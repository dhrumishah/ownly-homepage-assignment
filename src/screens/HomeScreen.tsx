/**
 * Homepage. Section order follows the Figma frame.
 *
 * Sticky model: the cuisine row and filter bar stay in normal flow; once each
 * reaches the dock line a static copy renders in an overlay. The copy never reads
 * `scrollY`, so it cannot trail it — a per-frame translate always lags by a frame
 * and the row visibly swims against the page. The two flags flip on the UI thread
 * and cross to JS only on a transition, so scrolling causes no re-renders.
 */
import { useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FilterBar } from "../components/FilterBar";
import { HeroHeader } from "../components/HeroHeader";
import { MealForOne } from "../components/MealForOne";
import { Rail } from "../components/Rail";
import { CuratedRestaurantCard, ReorderCard } from "../components/RailCards";
import { RestaurantCard } from "../components/RestaurantCard";
import { CuisineRow } from "../components/WhatsOnYourMind";
import { Tappable } from "../components/Tappable";
import { SectionHeader } from "../components/primitives";
import { NoResults } from "../components/states";
import { DEFAULT_FILTERS, applyFilters, type Filters } from "../filters";
import { colors, layout, radii, shadow, spacing, type } from "../theme";
import type { HomeFeed } from "../hooks/useHomeFeed";

/** Anchors start off-screen so nothing pins before the first layout pass. */
const UNMEASURED = 1e6;
const BACK_TO_TOP_AT = 900;
/** Gap between major sections (Figma: 17). */
const SECTION_GAP = 17;
/** Taller than any plausible rubber-band pull. */
const OVERSCROLL = 400;

export function HomeScreen({ feed }: { feed: HomeFeed }) {
  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollY = useSharedValue(0);
  const cuisineAnchorY = useSharedValue(UNMEASURED);
  const filterAnchorY = useSharedValue(UNMEASURED);

  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const visibleRestaurants = useMemo(
    () => applyFilters(feed.restaurants, filters),
    [feed.restaurants, filters],
  );

  const rowHeight = layout.cuisineRowHeight;
  /** On device the pinned stack must dock below the status bar, not under it. */
  const topInset = insets.top;

  /** Veg chip state lives here so both copies of the filter bar agree. */
  const [veg, setVeg] = useState(false);
  const [cuisinePinned, setCuisinePinned] = useState(false);
  const [filterPinned, setFilterPinned] = useState(false);

  useAnimatedReaction(
    () => scrollY.value >= cuisineAnchorY.value - topInset,
    (now, prev) => {
      if (now !== prev) runOnJS(setCuisinePinned)(now);
    },
  );

  useAnimatedReaction(
    () => scrollY.value >= filterAnchorY.value - topInset - rowHeight,
    (now, prev) => {
      if (now !== prev) runOnJS(setFilterPinned)(now);
    },
  );

  const backToTopStyle = useAnimatedStyle(() => {
    const p = Math.min(Math.max((scrollY.value - BACK_TO_TOP_AT) / 120, 0), 1);
    return { opacity: p, transform: [{ translateY: (1 - p) * 24 }] };
  });

  return (
    <View style={styles.root}>
      {/* Masthead colour behind the scroll view, so the top bounce reads as the
          header stretching. Must sit outside it — content above the content
          origin is not scrollable area and stays clipped. */}
      <View style={styles.topBleed} pointerEvents="none" />

      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: colors.bg,
          paddingBottom: insets.bottom + spacing.xxl,
        }}
      >
        {/* No delivery address in the fixtures; Figma's placeholder copy. */}
        <HeroHeader
          banners={feed.banners}
          area="HSR Layout"
          addressLine="3rd main road, 4th cross road"
        />

        {/* Each measured block below must stay a direct child of the scroll
            content, so its `onLayout` y is already in content coordinates. */}
        {feed.reorder.items.length > 0 && (
          <View style={styles.section}>
            <Rail title={feed.reorder.title}>
              {feed.reorder.items.map((item) => (
                <ReorderCard key={item.entityId} item={item} />
              ))}
            </Rail>
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader title={feed.whatsOnYourMind.title} />
        </View>
        <View
          onLayout={(e) => {
            cuisineAnchorY.value = e.nativeEvent.layout.y;
          }}
        >
          <CuisineRow items={feed.whatsOnYourMind.items} />
        </View>

        <View style={styles.section}>
          <MealForOne
            title={feed.mealForOne.title}
            headerImageUrl={feed.mealForOne.imageUrl}
            items={feed.mealForOne.items}
          />
        </View>

        {feed.curatedSections
          .filter((section) => section.items.length > 0)
          .map((section) => (
            <View key={section.id} style={styles.section}>
              <Rail title={section.title} seeAll>
                {section.items.map((item) => (
                  <CuratedRestaurantCard key={item.entityId} item={item} />
                ))}
              </Rail>
            </View>
          ))}

        <View style={styles.section}>
          <SectionHeader title="All restaurants" />
        </View>

        <View
          onLayout={(e) => {
            filterAnchorY.value = e.nativeEvent.layout.y;
          }}
        >
          <FilterBar
            filters={filters}
            onChange={setFilters}
            veg={veg}
            onVegChange={setVeg}
          />
        </View>

        {visibleRestaurants.length ? (
          <View style={styles.list}>
            {visibleRestaurants.map((item) => (
              <RestaurantCard key={item.entityId} item={item} />
            ))}
          </View>
        ) : (
          <NoResults onClear={() => setFilters(DEFAULT_FILTERS)} />
        )}
      </Animated.ScrollView>

      {/* Pinned stack — static copies at fixed offsets. */}
      {cuisinePinned && (
        <View
          style={[styles.safeFiller, { height: topInset }]}
          pointerEvents="none"
        />
      )}
      {cuisinePinned && (
        <View style={[styles.pinned, { top: topInset }]}>
          <CuisineRow items={feed.whatsOnYourMind.items} />
        </View>
      )}
      {filterPinned && (
        <View style={[styles.pinned, { top: topInset + rowHeight }]}>
          <FilterBar
            filters={filters}
            onChange={setFilters}
            veg={veg}
            onVegChange={setVeg}
          />
          <View style={styles.pinnedShadow} />
        </View>
      )}

      <Animated.View
        style={[
          styles.backToTop,
          { bottom: insets.bottom + spacing.xl },
          backToTopStyle,
        ]}
        pointerEvents="box-none"
      >
        <Tappable
          style={styles.backToTopPill}
          onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
          accessibilityRole="button"
        >
          <Text style={styles.backToTopText}>Back to top</Text>
        </Tappable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  section: { marginTop: SECTION_GAP },

  /** Taller than any plausible rubber-band pull; never visible at rest. */
  topBleed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: OVERSCROLL,
    backgroundColor: colors.brandHeader,
  },

  list: { gap: spacing.lg },

  safeFiller: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bg,
  },
  pinned: { position: "absolute", left: 0, right: 0, top: 0 },
  pinnedShadow: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -6,
    height: 6,
    backgroundColor: colors.bg,
    ...shadow.pinned,
  },

  backToTop: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  backToTopPill: {
    height: 34,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  backToTopText: { ...type.meta, color: colors.onBrand },
});
