/** Shapes mirror the fixture pack exactly — only fields the homepage actually reads. */

export type Rating = { value: number; count: number };

export type Serviceability = {
  isServiceable: boolean;
  message: string;
};

export type Banner = {
  id: string;
  name: string;
  imageUrl: string;
};

export type CuratedListDetail = {
  id: string;
  name: string;
  imageUrl: string;
  rank: number;
};

export type CuratedListGroup = {
  id: string;
  name: string;
  curatedListIds: string[];
  rank: number;
};

export type FeedConfig = {
  mealForOne: {
    id: string;
    name: string;
    curatedListDetailsList: CuratedListDetail[];
  };
  restaurant: {
    id: string;
    topBanner: { banners: Banner[]; rank: number };
    curatedListGroups: CuratedListGroup[];
    curatedListDetailsList: CuratedListDetail[];
    reOrderConfig: { name: string; rank: number; imageUrl: string };
  };
};

export type RestaurantEntity = {
  entityId: string;
  name: string;
  imageUrl: string;
  price?: number;
  etaInMinutes: number;
  distanceInKM: number;
  knownFor?: string[];
  address?: { city: string; area: string };
  displayTags?: string[];
  trustMarkers?: { type: string; name: string }[];
  platformRating?: Rating;
  orderingEnabled: boolean;
};

export type FoodItem = {
  foodItemId: string;
  resName: string;
  name: string;
  price: number;
  displayPrice: number;
  imageUrl: string;
  vegOrNonVeg: string;
  hasVariants: boolean;
  etaInMinutes: number;
  ResRatingResponse?: Rating;
};

/** A curated section resolved from config + its fetched cards. */
export type CuratedSection = {
  id: string;
  title: string;
  items: RestaurantEntity[];
};
