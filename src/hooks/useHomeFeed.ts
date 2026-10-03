/**
 * The load sequence from the brief: serviceability -> feed_config -> everything
 * else in parallel. Sections with no data come back empty and the screen hides them.
 */
import { useCallback, useEffect, useState } from "react";
import {
  checkServiceability,
  getCuratedListDetails,
  getCurrentFeedConfig,
  getFeedForCuratedList,
  getFeedForUserPastOrders,
  getPaginatedRestaurantFeed,
} from "../api/mockApi";
import type {
  Banner,
  CuratedListDetail,
  CuratedSection,
  FoodItem,
  RestaurantEntity,
  Serviceability,
} from "../types";

export type HomeFeed = {
  banners: Banner[];
  reorder: { title: string; items: RestaurantEntity[] };
  mealForOne: { title: string; imageUrl?: string; items: FoodItem[] };
  curatedSections: CuratedSection[];
  whatsOnYourMind: { title: string; items: CuratedListDetail[] };
  restaurants: RestaurantEntity[];
};

type State =
  | { status: "loading" }
  | { status: "blocked"; serviceability: Serviceability }
  | { status: "error"; message: string }
  | { status: "ready"; feed: HomeFeed };

const byRank = <T extends { rank: number }>(a: T, b: T) => a.rank - b.rank;

export function useHomeFeed() {
  const [state, setState] = useState<State>({ status: "loading" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      // Gate: nothing else is fetched until this passes.
      const serviceability = await checkServiceability();
      if (!serviceability.isServiceable) {
        setState({ status: "blocked", serviceability });
        return;
      }

      const config = await getCurrentFeedConfig();
      const { restaurant, mealForOne } = config;

      const mealForOneList = mealForOne.curatedListDetailsList?.[0];
      const curatedConfigs = (restaurant.curatedListDetailsList ?? [])
        .slice()
        .sort(byRank);
      const cuisineGroup = (restaurant.curatedListGroups ?? [])
        .slice()
        .sort(byRank)[0];

      const [
        pastOrders,
        mealForOneFeed,
        curatedFeeds,
        cuisineItems,
        restaurantFeed,
      ] = await Promise.all([
        getFeedForUserPastOrders(),
        mealForOneList
          ? getFeedForCuratedList(mealForOneList.id)
          : Promise.resolve({ FoodItems: [], EntityResults: [] }),
        Promise.all(curatedConfigs.map((c) => getFeedForCuratedList(c.id))),
        cuisineGroup
          ? getCuratedListDetails(cuisineGroup.curatedListIds)
          : Promise.resolve([] as CuratedListDetail[]),
        getPaginatedRestaurantFeed(),
      ]);

      setState({
        status: "ready",
        feed: {
          banners: restaurant.topBanner?.banners ?? [],
          reorder: {
            title: restaurant.reOrderConfig?.name || "Order Again!",
            items: pastOrders,
          },
          mealForOne: {
            title: mealForOneList?.name ?? "",
            imageUrl: mealForOneList?.imageUrl,
            items: mealForOneFeed.FoodItems,
          },
          curatedSections: curatedConfigs.map((c, i) => ({
            id: c.id,
            title: c.name,
            items: curatedFeeds[i]?.EntityResults ?? [],
          })),
          whatsOnYourMind: {
            title: cuisineGroup?.name ?? "What's on your mind?",
            items: cuisineItems,
          },
          restaurants: restaurantFeed,
        },
      });
    } catch (e) {
      setState({
        status: "error",
        message: e instanceof Error ? e.message : "Something went wrong",
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { state, reload: load };
}
