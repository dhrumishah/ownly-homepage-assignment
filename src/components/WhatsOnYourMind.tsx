/**
 * `curatedListGroups` + `curated_list_details`. HomeScreen renders this twice —
 * in flow and in the pinned overlay. Both copies are stateless, so the handover
 * is invisible.
 */
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Tappable } from "./Tappable";
import { colors, layout, radii, spacing, type } from "../theme";
import type { CuratedListDetail } from "../types";

export function CuisineRow({ items }: { items: CuratedListDetail[] }) {
  if (!items.length) return null;

  return (
    <View style={styles.row}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {items.map((item) => (
          <Tappable key={item.id} style={styles.item}>
            <Image
              source={item.imageUrl}
              style={styles.image}
              contentFit="contain"
              transition={200}
            />
            <Text style={styles.label} numberOfLines={1}>
              {item.name}
            </Text>
          </Tappable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: layout.cuisineRowHeight,
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  content: { paddingHorizontal: layout.screenPadding, gap: spacing.lg },
  item: { alignItems: "center", width: layout.cuisineItem },
  image: {
    width: layout.cuisineItem,
    height: layout.cuisineItem,
    borderRadius: radii.sm,
  },
  label: {
    ...type.meta,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
  },
});
