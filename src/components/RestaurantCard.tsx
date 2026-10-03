/** `paginated_restaurant_feed.data.EntityResults` — full-width card in the main listing. */
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Tappable } from "./Tappable";
import {
  ClosedOverlay,
  Dot,
  Eta,
  FamousForStrip,
  RatingPill,
  TrustBadge,
} from "./primitives";
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

export function RestaurantCard({ item }: { item: RestaurantEntity }) {
  const marker = item.trustMarkers?.[0]?.name;
  const famousFor = item.knownFor?.[0];
  const summary = [fmt.priceForOne(item.price), fmt.knownFor(item.knownFor)]
    .filter(Boolean)
    .join(" | ");

  return (
    <Tappable style={styles.card}>
      <View style={styles.imageWrap}>
        <Image
          source={item.imageUrl}
          style={fillParent}
          contentFit="cover"
          transition={300}
          accessibilityLabel={item.name}
        />

        {!!marker && (
          <View style={styles.badgeSlot}>
            <TrustBadge label={marker} />
          </View>
        )}

        {!!famousFor && (
          <View style={styles.stripSlot}>
            <FamousForStrip
              label={`Famous for its ${fmt.titleCase(famousFor)}`}
            />
          </View>
        )}

        {!item.orderingEnabled && <ClosedOverlay />}
      </View>

      <View style={styles.body}>
        <View style={styles.main}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.metaRow}>
            {!!item.platformRating?.value && (
              <>
                <RatingPill
                  value={item.platformRating.value}
                  count={item.platformRating.count}
                  size={14}
                />
                <Dot />
              </>
            )}
            <Eta minutes={item.etaInMinutes} size={14} />
          </View>

          {!!summary && (
            <Text style={styles.summary} numberOfLines={1}>
              {summary}
            </Text>
          )}
        </View>

        <View style={styles.side}>
          <Text style={styles.distance}>{fmt.distance(item.distanceInKM)}</Text>
          {!!item.address?.area && (
            <Text style={styles.area} numberOfLines={1}>
              {item.address.area}
            </Text>
          )}
        </View>
      </View>
    </Tappable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: layout.screenPadding,
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radii.card,
    ...shadow.card,
  },
  imageWrap: {
    width: "100%",
    aspectRatio: layout.listCardImageAspect,
    borderRadius: radii.lg,
    overflow: "hidden",
    backgroundColor: colors.borderCard,
  },
  badgeSlot: { position: "absolute", left: 8, top: 8 },
  stripSlot: { position: "absolute", left: 0, bottom: 14 },

  body: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  main: { flex: 1, gap: spacing.sm },
  name: { ...type.titleLg, color: colors.text, maxWidth: 240 },
  metaRow: rowCenter,
  summary: { ...type.meta, color: colors.textMuted },

  side: { alignItems: "flex-end", gap: spacing.xs },
  distance: { ...type.meta, color: colors.textSecondary },
  area: { ...type.meta, color: colors.textMuted, maxWidth: 103 },
});
