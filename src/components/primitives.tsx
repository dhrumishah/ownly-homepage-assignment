/** Shared visual atoms, each transcribed from a Figma component. */
import { useEffect } from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Tappable } from "./Tappable";
import { absoluteFill, colors, radii, spacing, type } from "../theme";
import * as fmt from "../format";

export function SectionHeader({
  title,
  seeAll,
}: {
  title: string;
  seeAll?: boolean;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle} numberOfLines={1}>
        {title}
      </Text>
      {seeAll && (
        <Tappable style={styles.seeAll} accessibilityRole="button">
          <Text style={styles.seeAllText}>See all</Text>
          <MaterialIcons
            name="arrow-forward-ios"
            size={11}
            color={colors.brand}
          />
        </Tappable>
      )}
    </View>
  );
}

export function RatingPill({
  value,
  count,
  size = 12,
}: {
  value?: number;
  count?: number;
  size?: number;
}) {
  if (!value) return null;

  const label = fmt.ratingCount(count);

  return (
    <View style={styles.inlineRow}>
      <View
        style={[
          styles.ratingCircle,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <MaterialIcons name="star" size={size * 0.62} color={colors.onBrand} />
      </View>
      <Text style={[styles.ratingText, size > 12 && type.link]}>
        {fmt.rating(value)}
        {label ? ` (${label})` : ""}
      </Text>
    </View>
  );
}

export function Eta({
  minutes,
  size = 12,
}: {
  minutes?: number;
  size?: number;
}) {
  if (!minutes) return null;
  return (
    <View style={styles.inlineRow}>
      <MaterialCommunityIcons
        name="lightning-bolt"
        size={size}
        color={colors.textSecondary}
      />
      <Text style={[styles.meta, size > 12 && type.link]}>
        {fmt.eta(minutes)}
      </Text>
    </View>
  );
}

export const Dot = () => <View style={styles.dot} />;

export function VegMark({ vegOrNonVeg }: { vegOrNonVeg?: string }) {
  const tint =
    vegOrNonVeg?.toLowerCase() === "veg" ? colors.veg : colors.nonVeg;
  return (
    <View style={[styles.vegMark, { borderColor: tint }]}>
      <View style={[styles.vegFill, { backgroundColor: tint }]} />
    </View>
  );
}

/** "Lowest Price" is the only marker the fixtures send, so it is the only palette. */
export function TrustBadge({ label }: { label: string }) {
  return (
    <View style={styles.badge}>
      <MaterialCommunityIcons name="tag" size={12} color={colors.marker} />
      <Text style={styles.badgeText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function ClosedOverlay() {
  return (
    <View style={styles.closed}>
      <Text style={styles.closedText}>Currently closed</Text>
    </View>
  );
}

export function FamousForStrip({ label }: { label: string }) {
  return (
    <View style={styles.strip}>
      <View style={styles.stripBar} />
      <Text style={styles.stripText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

export function Skeleton({ style }: { style?: ViewStyle | ViewStyle[] }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [progress]);

  const animated = useAnimatedStyle(() => ({
    opacity: 0.45 + progress.value * 0.45,
  }));

  return <Animated.View style={[styles.skeleton, style, animated]} />;
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionTitle: { ...type.sectionTitle, color: colors.text, flexShrink: 1 },
  seeAll: { flexDirection: "row", alignItems: "center", gap: spacing.xxs },
  seeAllText: { ...type.link, color: colors.brand },

  inlineRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  ratingCircle: {
    backgroundColor: colors.rating,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingText: { ...type.meta, color: colors.rating },
  meta: { ...type.meta, color: colors.textSecondary },

  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    marginHorizontal: spacing.xs,
  },

  vegMark: {
    width: 12,
    height: 8,
    borderWidth: 1,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  vegFill: { width: 8, height: 4, borderRadius: radii.pill },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.onBrand,
    backgroundColor: colors.markerBg,
  },
  badgeText: { ...type.micro, color: colors.marker },

  closed: {
    ...absoluteFill,
    backgroundColor: colors.scrim,
    alignItems: "center",
    justifyContent: "center",
  },
  closedText: { ...type.cardTitle, color: colors.onBrand },

  strip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 25,
    maxWidth: 258,
    paddingRight: spacing.sm,
    backgroundColor: colors.strip,
    borderTopRightRadius: radii.hero,
    borderBottomRightRadius: radii.hero,
  },
  stripBar: { width: 4, height: 25, backgroundColor: colors.accentBar },
  stripText: { ...type.metaMedium, color: colors.onBrand, flexShrink: 1 },

  skeleton: { backgroundColor: colors.skeleton, borderRadius: radii.md },
});
