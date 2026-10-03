/** Cards for the two horizontal restaurant rails. */
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Tappable } from "./Tappable";
import { ClosedOverlay, Dot, Eta, RatingPill, TrustBadge } from "./primitives";
import {
  colors,
  fillParent,
  layout,
  radii,
  rowCenter,
  shadow,
  spacing,
  type,
} from "../theme";
import * as fmt from "../format";
import type { RestaurantEntity } from "../types";

/** `past_orders.data.EntityResults` — 155×214 reorder card. */
export function ReorderCard({ item }: { item: RestaurantEntity }) {
  return (
    <Tappable style={styles.reorderCard}>
      <Image
        source={item.imageUrl}
        style={styles.reorderImage}
        contentFit="cover"
        transition={250}
        accessibilityLabel={item.name}
      />

      <View style={styles.reorderBody}>
        <View style={styles.titleGroup}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.metaRow}>
            {!!item.platformRating?.value && (
              <>
                <RatingPill
                  value={item.platformRating.value}
                  count={item.platformRating.count}
                />
                <Dot />
              </>
            )}
            <Eta minutes={item.etaInMinutes} />
          </View>
        </View>

        {!!item.displayTags?.[0] && (
          <Text style={styles.lastOrdered} numberOfLines={1}>
            {item.displayTags[0]}
          </Text>
        )}
      </View>
    </Tappable>
  );
}

/** `curated_feed_res_item.data.EntityResults` — 160×229 curated card. */
export function CuratedRestaurantCard({ item }: { item: RestaurantEntity }) {
  const marker = item.trustMarkers?.[0]?.name;

  return (
    <Tappable style={styles.curatedCard}>
      <View style={styles.curatedImageWrap}>
        <Image
          source={item.imageUrl}
          style={fillParent}
          contentFit="cover"
          transition={250}
          accessibilityLabel={item.name}
        />
        {!!marker && (
          <View style={styles.badgeSlot}>
            <TrustBadge label={marker} />
          </View>
        )}
        {!item.orderingEnabled && <ClosedOverlay />}
      </View>

      <View style={styles.curatedBody}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.metaRow}>
          {!!item.platformRating?.value && (
            <>
              <RatingPill
                value={item.platformRating.value}
                count={item.platformRating.count}
              />
              <Dot />
            </>
          )}
          <Eta minutes={item.etaInMinutes} />
        </View>
        <Text style={styles.cuisines} numberOfLines={1}>
          {fmt.knownFor(item.knownFor) || fmt.priceForOne(item.price)}
        </Text>
      </View>
    </Tappable>
  );
}

const card = {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.borderCard,
  borderRadius: radii.lg,
  ...shadow.card,
} as const;

const styles = StyleSheet.create({
  reorderCard: {
    ...card,
    width: layout.reorderCard.width,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  reorderImage: {
    width: layout.reorderCard.image,
    height: layout.reorderCard.image,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.borderCard,
  },
  reorderBody: { gap: spacing.sm },
  titleGroup: { gap: spacing.xs },
  lastOrdered: { ...type.microSemi, color: colors.textSecondary },

  curatedCard: {
    ...card,
    width: layout.curatedCard.width,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  curatedImageWrap: {
    width: layout.curatedCard.image,
    height: layout.curatedCard.image,
    borderRadius: radii.md,
    overflow: "hidden",
    backgroundColor: colors.borderCard,
  },
  badgeSlot: { position: "absolute", left: 4, bottom: 4 },
  curatedBody: { gap: spacing.sm },

  name: { ...type.cardTitle, color: colors.text },
  metaRow: rowCenter,
  cuisines: { ...type.meta, color: colors.textSecondary },
});
