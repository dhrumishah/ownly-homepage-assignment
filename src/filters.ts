/** Client-side filtering/sorting for the main restaurant listing. */
import type { RestaurantEntity } from "./types";

export type SortKey = "relevance" | "rating" | "eta" | "distance";

export type Filters = {
  sort: SortKey;
  topRated: boolean;
  fastDelivery: boolean;
  budget: boolean;
};

export const RATING_THRESHOLD = 4;
export const FAST_DELIVERY_MINUTES = 30;
export const BUDGET_PRICE = 200;

export const DEFAULT_FILTERS: Filters = {
  sort: "relevance",
  topRated: false,
  fastDelivery: false,
  budget: false,
};

/** Menu order, and the single source of truth for sort naming. */
export const SORT_OPTIONS: ReadonlyArray<{ key: SortKey; label: string }> = [
  { key: "relevance", label: "Relevance" },
  { key: "rating", label: "Rating: high to low" },
  { key: "eta", label: "Delivery time" },
  { key: "distance", label: "Distance" },
];

/** The chip names the active sort, or prompts when nothing is applied. */
export const sortChipLabel = (key: SortKey): string =>
  key === "relevance"
    ? "Sort by"
    : (SORT_OPTIONS.find((o) => o.key === key)?.label ?? "Sort by");

export function applyFilters(
  items: readonly RestaurantEntity[],
  filters: Filters,
): RestaurantEntity[] {
  const matched = items.filter((item) => {
    if (
      filters.topRated &&
      (item.platformRating?.value ?? 0) < RATING_THRESHOLD
    )
      return false;
    if (filters.fastDelivery && item.etaInMinutes > FAST_DELIVERY_MINUTES)
      return false;
    if (filters.budget && (item.price ?? Infinity) > BUDGET_PRICE) return false;
    return true;
  });

  // `sort` mutates, so sort a copy.
  const sorted = [...matched];
  switch (filters.sort) {
    case "rating":
      return sorted.sort(
        (a, b) =>
          (b.platformRating?.value ?? 0) - (a.platformRating?.value ?? 0),
      );
    case "eta":
      return sorted.sort((a, b) => a.etaInMinutes - b.etaInMinutes);
    case "distance":
      return sorted.sort((a, b) => a.distanceInKM - b.distanceInKM);
    default:
      return sorted;
  }
}
