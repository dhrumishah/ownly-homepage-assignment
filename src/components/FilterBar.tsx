/** Chip row above the main listing. Pins under the cuisine strip when scrolled past. */
import { useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Tappable } from "./Tappable";
import { VegMark } from "./primitives";
import {
  absoluteFill,
  colors,
  layout,
  radii,
  shadow,
  spacing,
  type,
} from "../theme";
import {
  BUDGET_PRICE,
  FAST_DELIVERY_MINUTES,
  RATING_THRESHOLD,
  SORT_OPTIONS,
  sortChipLabel,
  type Filters,
  type SortKey,
} from "../filters";

function Chip({
  label,
  active,
  onPress,
  leading,
  trailing,
  tint,
  activeStyle,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  tint?: string;
  activeStyle?: "fill" | "outline";
}) {
  const filled = active && activeStyle !== "outline";
  const outlined = active && activeStyle === "outline";

  return (
    <Tappable
      style={[
        styles.chip,
        filled && styles.chipFilled,
        outlined && styles.chipOutlined,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {leading}
      <Text
        style={[
          styles.chipText,
          active && styles.chipTextActive,
          !!tint && { color: tint },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {trailing}
    </Tappable>
  );
}

export function FilterBar({
  filters,
  onChange,
  veg,
  onVegChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  /** The Figma includes a Veg chip, but restaurants carry no veg flag in the
      feed — it holds its selected state and filters nothing. Owned by the
      screen so the in-flow and pinned copies of this bar stay in sync. */
  veg: boolean;
  onVegChange: (next: boolean) => void;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  /** Where to hang the sort menu; null means closed. */
  const sortChipRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);

  return (
    <View style={styles.bar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View ref={sortChipRef} collapsable={false}>
          <Chip
            label={sortChipLabel(filters.sort)}
            active={filters.sort !== "relevance"}
            onPress={() =>
              sortChipRef.current?.measureInWindow((x, y, _w, h) =>
                setAnchor({ x, y: y + h + spacing.xs }),
              )
            }
            trailing={
              <MaterialIcons
                name="keyboard-arrow-down"
                size={14}
                color={colors.text}
              />
            }
          />
        </View>

        <Chip
          label={`${RATING_THRESHOLD}+`}
          active={filters.topRated}
          tint={colors.rating}
          onPress={() => set({ topRated: !filters.topRated })}
          leading={
            <View style={styles.ratingDot}>
              <MaterialIcons name="star" size={8} color={colors.onBrand} />
            </View>
          }
        />

        <Chip
          label={`Under ${FAST_DELIVERY_MINUTES} mins`}
          active={filters.fastDelivery}
          onPress={() => set({ fastDelivery: !filters.fastDelivery })}
        />

        <Chip
          label={`Under ₹${BUDGET_PRICE}`}
          active={filters.budget}
          onPress={() => set({ budget: !filters.budget })}
        />

        <Chip
          label="Veg"
          active={veg}
          activeStyle="outline"
          onPress={() => onVegChange(!veg)}
          leading={<VegMark vegOrNonVeg="veg" />}
        />
      </ScrollView>

      <SortMenu
        anchor={anchor}
        value={filters.sort}
        onSelect={(sort) => set({ sort })}
        onClose={() => setAnchor(null)}
      />
    </View>
  );
}

/** The Sort chip carries a caret, so it opens a menu rather than cycling. */
function SortMenu({
  anchor,
  value,
  onSelect,
  onClose,
}: {
  anchor: { x: number; y: number } | null;
  value: SortKey;
  onSelect: (key: SortKey) => void;
  onClose: () => void;
}) {
  if (!anchor) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      {/* Catches the tap-outside. No scrim: a dropdown this small should not
          dim the page behind it. */}
      <Pressable
        style={absoluteFill}
        onPress={onClose}
        accessibilityLabel="Dismiss sort options"
      />
      <View style={[styles.menu, { top: anchor.y, left: anchor.x }]}>
        {SORT_OPTIONS.map(({ key, label }, i) => (
          <Tappable
            key={key}
            style={[styles.option, i > 0 && styles.optionDivided]}
            onPress={() => {
              onSelect(key);
              onClose();
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected: key === value }}
          >
            <Text
              style={[
                styles.optionText,
                key === value && styles.optionTextActive,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
            {key === value && (
              <MaterialIcons name="check" size={15} color={colors.brand} />
            )}
          </Tappable>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: layout.filterBarHeight,
    justifyContent: "center",
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing.md,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    height: 30,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipFilled: {
    backgroundColor: colors.chipSelected,
    borderColor: colors.chipSelected,
  },
  chipOutlined: { backgroundColor: colors.vegChipBg, borderColor: colors.veg },
  chipText: { ...type.metaRegular, color: colors.text },
  chipTextActive: { fontFamily: type.meta.fontFamily },

  ratingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.rating,
    alignItems: "center",
    justifyContent: "center",
  },

  menu: {
    position: "absolute",
    width: 184,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.pinned,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
    height: 38,
  },
  optionDivided: { borderTopWidth: 1, borderTopColor: colors.borderCard },
  optionText: {
    ...type.metaRegular,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  optionTextActive: {
    fontFamily: type.meta.fontFamily,
    color: colors.text,
  },
});
