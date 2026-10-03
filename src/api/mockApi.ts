/**
 * Mock API over the fixture pack. One function per endpoint named in the brief,
 * so swapping these for `fetch` calls is the only change needed to go live.
 */
import fixtures from "../../homepage-assignment-candidate-fixtures.json";
import type {
  FeedConfig,
  FoodItem,
  RestaurantEntity,
  CuratedListDetail,
  Serviceability,
} from "../types";

/** Flip to `true` to exercise the non-serviceable screen (fixture: `not_serviceable`). */
export const FORCE_NOT_SERVICEABLE = false;

/**
 * Fake network latency so loading states are actually visible. The load runs in
 * three sequential stages (serviceability -> feed config -> parallel batch), so
 * 200 + 250 + 250 = 700 ms end to end.
 */
const LATENCY_MS = 250;

const respond = <T>(data: T, ms = LATENCY_MS): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

/** POST /serviceability/check */
export const checkServiceability = (): Promise<Serviceability> =>
  respond(
    (FORCE_NOT_SERVICEABLE ? fixtures.not_serviceable : fixtures.serviceability)
      .data as Serviceability,
    200,
  );

/** GET /feed-configs/current-feed-config */
export const getCurrentFeedConfig = (): Promise<FeedConfig> =>
  respond(fixtures.feed_config.data as unknown as FeedConfig);

/**
 * POST /getFeedForCuratedList — three ids: meal-for-one (`FoodItems`) and the two
 * restaurant rails (`EntityResults`). The pack ships one response per shape, so
 * the rails slice the shared fixture by rank rather than repeat it.
 */
const MEAL_FOR_ONE_ID =
  fixtures.feed_config.data.mealForOne.curatedListDetailsList[0].id;

export function getFeedForCuratedList(curatedListId: string): Promise<{
  FoodItems: FoodItem[];
  EntityResults: RestaurantEntity[];
}> {
  if (curatedListId === MEAL_FOR_ONE_ID) {
    return respond({
      FoodItems: (fixtures.curated_feed_Food_item.data.FoodItems ??
        []) as FoodItem[],
      EntityResults: [],
    });
  }

  const all = (fixtures.curated_feed_res_item.data.EntityResults ??
    []) as RestaurantEntity[];
  const restaurantCuratedIds =
    fixtures.feed_config.data.restaurant.curatedListDetailsList
      .slice()
      .sort((a, b) => a.rank - b.rank)
      .map((c) => c.id);

  const position = restaurantCuratedIds.indexOf(curatedListId);
  const slots = Math.max(restaurantCuratedIds.length, 1);
  const perSection = Math.ceil(all.length / slots);
  const items =
    position < 0
      ? all
      : all.slice(position * perSection, (position + 1) * perSection);

  return respond({ FoodItems: [], EntityResults: items });
}

/** POST /getCuratedListDetails — details for the requested ids, in that order. */
export function getCuratedListDetails(
  ids: string[],
): Promise<CuratedListDetail[]> {
  const byId = new Map(
    (fixtures.curated_list_details.data as CuratedListDetail[]).map((d) => [
      d.id,
      d,
    ]),
  );
  return respond(
    ids.map((id) => byId.get(id)).filter((d): d is CuratedListDetail => !!d),
  );
}

/** POST /get-feed-for-user-past-orders */
export const getFeedForUserPastOrders = (): Promise<RestaurantEntity[]> =>
  respond(
    (fixtures.past_orders.data.EntityResults ?? []) as RestaurantEntity[],
  );

/** POST /getPaginatedRestaurantFeed */
export const getPaginatedRestaurantFeed = (): Promise<RestaurantEntity[]> =>
  respond(
    (fixtures.paginated_restaurant_feed.data.EntityResults ??
      []) as RestaurantEntity[],
  );
