/**
 * Meal-for-one: `mealForOne.curatedListDetailsList` for the header art,
 * `curated_feed_Food_item.data.FoodItems` for the cards. The panel background
 * reproduces the curated list's own `backGroundColour`.
 */
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { Tappable } from "./Tappable";
import { Dot, Eta, RatingPill, VegMark } from "./primitives";
import {
  colors,
  fillParent,
  gradients,
  layout,
  radii,
  rowCenter,
  spacing,
  type,
} from "../theme";
import * as fmt from "../format";
import type { FoodItem } from "../types";

const ADD_BUTTON = 40;

function AddButton() {
  return (
    <Tappable style={styles.addButton} accessibilityRole="button">
      <MaterialIcons name="add" size={22} color={colors.onBrand} />
    </Tappable>
  );
}

function FoodCard({ item }: { item: FoodItem }) {
  const current = item.displayPrice || item.price;
  const struck = item.price > current ? item.price : undefined;

  return (
    <View style={styles.foodCard}>
      <View style={styles.foodImageWrap}>
        <Image
          source={item.imageUrl}
          style={fillParent}
          contentFit="cover"
          transition={250}
          accessibilityLabel={item.name}
        />
        <AddButton />
      </View>

      <View style={styles.foodBody}>
        <View style={styles.nameRow}>
          {/* nudged down so the marker sits on the first text line */}
          <View style={styles.vegAlign}>
            <VegMark vegOrNonVeg={item.vegOrNonVeg} />
          </View>
          <Text style={styles.foodName} numberOfLines={2}>
            {item.name}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <View style={styles.pricePill}>
            <Text style={styles.priceText}>{fmt.price(current)}</Text>
          </View>
          {!!struck && (
            <Text style={styles.strikePrice}>{fmt.price(struck)}</Text>
          )}
        </View>

        <View style={styles.metaRow}>
          {!!item.ResRatingResponse?.value && (
            <>
              <RatingPill value={item.ResRatingResponse.value} />
              <Dot />
            </>
          )}
          <Eta minutes={item.etaInMinutes} />
        </View>

        <Text style={styles.resName} numberOfLines={1}>
          {item.resName}
        </Text>
        {item.hasVariants && <Text style={styles.variants}>Customisable</Text>}
      </View>
    </View>
  );
}

export function MealForOne({
  title,
  headerImageUrl,
  items,
}: {
  title: string;
  headerImageUrl?: string;
  items: FoodItem[];
}) {
  if (!items.length) return null;

  return (
    <View style={styles.outer}>
      <LinearGradient
        colors={[...gradients.mealForOne]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.92, y: 1 }}
        style={styles.panel}
      >
        <View style={styles.header}>
          {headerImageUrl ? (
            <Image
              source={headerImageUrl}
              style={styles.headerArt}
              contentFit="contain"
              contentPosition="left center"
              transition={300}
              accessibilityLabel={title}
            />
          ) : (
            <Text style={styles.headerFallback} numberOfLines={2}>
              {title}
            </Text>
          )}

          <LinearGradient
            colors={[...gradients.seeAll]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.seeAllPill}
          >
            <Tappable
              style={styles.seeAllInner}
              accessibilityRole="button"
            >
              <Text style={styles.seeAllText}>See all</Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={11}
                color={colors.brand}
              />
            </Tappable>
          </LinearGradient>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {items.map((item) => (
            <FoodCard key={item.foodItemId} item={item} />
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { paddingHorizontal: layout.screenPadding },
  panel: {
    borderRadius: radii.xl,
    paddingVertical: spacing.lg,
    paddingLeft: spacing.lg,
    gap: spacing.lg,
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 80,
  },
  headerArt: { width: 150, height: 80 },
  headerFallback: { ...type.titleLg, color: colors.text, flexShrink: 1 },
  seeAllPill: {
    borderTopLeftRadius: radii.hero,
    borderBottomLeftRadius: radii.hero,
  },
  seeAllInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
  seeAllText: { ...type.link, color: colors.brand },

  row: { gap: spacing.lg, paddingRight: spacing.lg },

  foodCard: { width: layout.foodCard.width, gap: spacing.sm },
  foodImageWrap: {
    width: layout.foodCard.image,
    height: layout.foodCard.image,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  addButton: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: ADD_BUTTON,
    height: ADD_BUTTON,
    borderRadius: radii.pill,
    backgroundColor: colors.brand,
    alignItems: "center",
    justifyContent: "center",
  },

  foodBody: { gap: spacing.xs },
  nameRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.xs },
  vegAlign: { marginTop: 5 },
  foodName: { ...type.itemName, color: colors.text, flexShrink: 1, minHeight: 34 },

  priceRow: { flexDirection: "row", alignItems: "center", gap: spacing.xxs },
  pricePill: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xxs,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.brand,
    borderRadius: radii.sm,
  },
  priceText: {
    ...type.meta,
    fontFamily: type.cardTitle.fontFamily,
    color: colors.brand,
  },
  strikePrice: {
    ...type.body,
    color: colors.textSecondary,
    textDecorationLine: "line-through",
  },

  metaRow: rowCenter,
  resName: { ...type.meta, color: colors.textMuted },
  variants: { ...type.microSemi, color: colors.textMuted },
});
