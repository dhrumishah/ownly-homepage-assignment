/** Loading, non-serviceable, error and empty-result screens. */
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Tappable } from "./Tappable";
import { Skeleton } from "./primitives";
import { colors, layout, radii, spacing, type } from "../theme";
import type { Serviceability } from "../types";

/** Enough placeholders to cover the viewport, plus one peeking off the edge. */
const fillCount = (width: number, item: number) =>
  Math.ceil(width / (item + spacing.md)) + 1;

/** Mirrors the homepage layout so the swap to real content doesn't jump. */
export function HomeSkeleton() {
  const { width } = useWindowDimensions();

  return (
    <ScrollView
      scrollEnabled={false}
      contentContainerStyle={styles.skeletonWrap}
      showsVerticalScrollIndicator={false}
    >
      <Skeleton style={styles.hero} />

      <Skeleton style={styles.heading} />
      <View style={styles.row}>
        {Array.from({ length: fillCount(width, layout.reorderCard.width) }, (_, i) => (
          <View key={i} style={styles.railItem}>
            <Skeleton style={styles.railImage} />
            <Skeleton style={styles.lineWide} />
            <Skeleton style={styles.lineNarrow} />
          </View>
        ))}
      </View>

      <Skeleton style={styles.heading} />
      <View style={styles.row}>
        {Array.from({ length: fillCount(width, layout.cuisineItem) }, (_, i) => (
          <View key={i} style={styles.cuisineItem}>
            <Skeleton style={styles.cuisineArt} />
            <Skeleton style={styles.lineTiny} />
          </View>
        ))}
      </View>

      <Skeleton style={styles.heading} />
      {[0, 1].map((i) => (
        <View key={i} style={styles.listItem}>
          <Skeleton style={styles.listImage} />
          <Skeleton style={styles.lineWide} />
          <Skeleton style={styles.lineNarrow} />
        </View>
      ))}
    </ScrollView>
  );
}

export function NotServiceable({
  serviceability,
  onRetry,
}: {
  serviceability: Serviceability;
  onRetry: () => void;
}) {
  return (
    <View style={styles.centered}>
      <View style={styles.badge}>
        <MaterialIcons name="location-off" size={30} color={colors.brand} />
      </View>
      <Text style={styles.title}>We don’t deliver here yet</Text>
      <Text style={styles.subtitle}>
        {serviceability.message}. Try a different delivery location — we’re
        expanding fast.
      </Text>
      <Tappable
        style={styles.button}
        onPress={onRetry}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Change location</Text>
      </Tappable>
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.centered}>
      <View style={styles.badge}>
        <MaterialIcons name="wifi-off" size={28} color={colors.brand} />
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.subtitle}>{message}</Text>
      <Tappable
        style={styles.button}
        onPress={onRetry}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Try again</Text>
      </Tappable>
    </View>
  );
}

/** Shown when active filters leave the main listing empty. */
export function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <View style={styles.noResults}>
      <Text style={styles.noResultsTitle}>
        No restaurants match these filters
      </Text>
      <Text style={styles.subtitle}>
        Try removing a filter to see more places near you.
      </Text>
      <Tappable
        style={styles.buttonGhost}
        onPress={onClear}
        accessibilityRole="button"
      >
        <Text style={styles.buttonGhostText}>Clear all filters</Text>
      </Tappable>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonWrap: { paddingBottom: spacing.xxl },
  hero: {
    height: 280,
    borderRadius: 0,
    borderBottomLeftRadius: radii.hero,
    borderBottomRightRadius: radii.hero,
  },
  heading: {
    width: 180,
    height: 17,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    marginHorizontal: layout.screenPadding,
    borderRadius: radii.sm,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: layout.screenPadding,
    gap: spacing.md,
    overflow: "hidden",
  },
  railItem: { width: layout.reorderCard.width, gap: spacing.sm },
  railImage: {
    width: "100%",
    height: layout.reorderCard.image,
    borderRadius: radii.md,
  },
  cuisineItem: { alignItems: "center", gap: spacing.sm },
  cuisineArt: {
    width: layout.cuisineItem,
    height: layout.cuisineItem,
    borderRadius: radii.sm,
  },
  listItem: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  listImage: {
    width: "100%",
    aspectRatio: layout.listCardImageAspect,
    borderRadius: radii.lg,
  },
  lineWide: { width: "70%", height: 14, borderRadius: radii.sm },
  lineNarrow: { width: "45%", height: 12, borderRadius: radii.sm },
  lineTiny: { width: 48, height: 10, borderRadius: radii.sm },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
    gap: spacing.md,
  },
  badge: {
    width: 72,
    height: 72,
    borderRadius: radii.pill,
    backgroundColor: "#FFF0F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  title: { ...type.titleLg, color: colors.text, textAlign: "center" },
  subtitle: {
    ...type.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
  },
  buttonText: { ...type.link, color: colors.onBrand },

  noResults: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  noResultsTitle: { ...type.cardTitle, color: colors.text },
  buttonGhost: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
  },
  buttonGhostText: { ...type.meta, color: colors.brand },
});
