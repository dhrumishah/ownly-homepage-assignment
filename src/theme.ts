/** Design tokens from the Figma frame. Components hardcode nothing. */

export const colors = {
  brand: "#FF297D",
  brandHeader: "#FA287B",
  brandRing: "#FF87B1",
  accentBar: "#DE4F85",

  bg: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceAlt: "#FCFCFC",
  chipSelected: "#E9E9E9",

  border: "#E9E9E9",
  borderCard: "#F9F9F9",
  track: "#D9D9D9",

  text: "#333333",
  textSecondary: "#666666",
  textMuted: "#999999",
  onBrand: "#FFFFFF",

  rating: "#17A821",
  /** "Lowest Price" trust marker — the only one the fixtures carry. */
  marker: "#ED7756",
  markerBg: "#FFFCE6",
  nonVeg: "#F54545",
  veg: "#097E11",
  vegChipBg: "#EBFFED",
  vegToggleOn: "#12D80F",

  strip: "rgba(51,51,51,0.9)",
  scrim: "rgba(51,51,51,0.72)",

  skeleton: "#EFEFF2",
} as const;

/** expo-linear-gradient colour stops. */
export const gradients = {
  banner: ["#FF297D", "#99184B"] as const,
  /** Mirrors the fixture's `backGroundColour`. */
  mealForOne: ["#FCFCFC", "#F7ECDF"] as const,
  seeAll: ["#FFFFFF", "#F9F3EC"] as const,
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  card: 20,
  xl: 24,
  hero: 32,
  pill: 100,
} as const;

/** Loaded in App.tsx. */
export const fonts = {
  regular: "Figtree_400Regular",
  medium: "Figtree_500Medium",
  semibold: "Figtree_600SemiBold",
  bold: "Figtree_700Bold",
} as const;

export const type = {
  titleLg: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 19 },
  sectionTitle: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 17 },
  cardTitle: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 17 },
  itemName: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 17 },
  link: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 17 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 17 },
  meta: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 14 },
  metaMedium: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 14 },
  metaRegular: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 14 },
  micro: { fontFamily: fonts.bold, fontSize: 10, lineHeight: 12 },
  microSemi: { fontFamily: fonts.semibold, fontSize: 10, lineHeight: 12 },
} as const;

export const layout = {
  screenPadding: 16,

  bannerHeight: 173,
  /** Wide screens: banner stops growing here and the artwork is letterboxed. */
  bannerMaxHeight: 280,
  bannerArtAspect: 2.02,
  appBarHeight: 62,
  searchHeight: 42,

  reorderCard: { width: 155, image: 131 },
  curatedCard: { width: 160, image: 144 },
  foodCard: { width: 120, image: 120 },
  cuisineItem: 72,
  listCardImageAspect: 334 / 206,

  cuisineRowHeight: 100,
  filterBarHeight: 54,

  maxContentWidth: 1200,
  twoColumnsAt: 640,
  threeColumnsAt: 1000,
} as const;

export const shadow = {
  card: {
    shadowColor: "#DDDDDD",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  pinned: {
    shadowColor: "#000000",
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
} as const;

/** `StyleSheet.absoluteFillObject` is absent from RN 0.86's type surface. */
export const absoluteFill = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
} as const;

export const fillParent = { width: "100%", height: "100%" } as const;

export const rowCenter = {
  flexDirection: "row",
  alignItems: "center",
} as const;
