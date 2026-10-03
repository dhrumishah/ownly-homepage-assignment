/**
 * Pink masthead: location bar, veg toggle, search row, and the top banner from
 * `feed_config.data.restaurant.topBanner`. Scrolls with the page, as in Figma.
 */
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tappable } from "./Tappable";
import { colors, gradients, layout, radii, spacing, type } from "../theme";
import type { Banner } from "../types";

const TOGGLE = { width: 108, height: 42, knob: 77, inset: 1 };
const VEG_SWITCH = { width: 32, height: 16, knob: 12 };

function LocationBar({ area, line2 }: { area: string; line2: string }) {
  return (
    <Tappable style={styles.location} accessibilityRole="button">
      <View style={styles.locationRow}>
        <Text style={styles.locationTitle} numberOfLines={1}>
          {area}
        </Text>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={18}
          color={colors.text}
        />
      </View>
      <Text style={styles.locationSub} numberOfLines={1}>
        {line2}
      </Text>
    </Tappable>
  );
}

function VegToggle() {
  const [on, setOn] = useState(false);
  const progress = useDerivedValue(
    () => withTiming(on ? 1 : 0, { duration: 180 }),
    [on],
  );

  const knob = useAnimatedStyle(() => ({
    transform: [
      { translateX: progress.value * (VEG_SWITCH.width - VEG_SWITCH.knob - 4) },
    ],
  }));
  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.track, colors.vegToggleOn],
    ),
  }));

  return (
    <Tappable
      style={styles.vegToggle}
      onPress={() => setOn((v) => !v)}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
    >
      <Text style={styles.vegLabel}>VEG</Text>
      <Animated.View style={[styles.vegTrack, track]}>
        <Animated.View style={[styles.vegKnob, knob]} />
      </Animated.View>
    </Tappable>
  );
}

/** `LOWEST PRICE MODE` switch — the knob slides and the state label swaps sides. */
function PriceModeToggle() {
  const [on, setOn] = useState(false);
  const progress = useDerivedValue(
    () => withTiming(on ? 1 : 0, { duration: 200 }),
    [on],
  );

  const knob = useAnimatedStyle(() => ({
    transform: [
      {
        translateX:
          progress.value * (TOGGLE.width - TOGGLE.knob - TOGGLE.inset * 2),
      },
    ],
  }));
  const offLabel = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  const onLabel = useAnimatedStyle(() => ({ opacity: progress.value }));

  return (
    <Tappable
      style={styles.priceMode}
      onPress={() => setOn((v) => !v)}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
    >
      <Animated.Text style={[styles.priceModeState, styles.stateLeft, onLabel]}>
        On
      </Animated.Text>
      <Animated.Text
        style={[styles.priceModeState, styles.stateRight, offLabel]}
      >
        Off
      </Animated.Text>
      <Animated.View style={[styles.priceModeKnob, knob]}>
        <Text style={styles.priceModeText}>LOWEST</Text>
        <Text style={styles.priceModeText}>PRICE MODE</Text>
      </Animated.View>
    </Tappable>
  );
}

export function HeroHeader({
  banners,
  area,
  addressLine,
}: {
  banners: Banner[];
  area: string;
  addressLine: string;
}) {
  const insets = useSafeAreaInsets();
  const banner = banners[0];

  return (
    <View>
      <View style={[styles.masthead, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.appBar}>
          <LocationBar area={area} line2={addressLine} />
          <View style={styles.appBarRight}>
            <VegToggle />
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchRow}>
          <Tappable style={styles.searchPill} accessibilityRole="search">
            <MaterialIcons name="search" size={16} color={colors.textMuted} />
            <Text style={styles.searchText}>Search</Text>
          </Tappable>
          <PriceModeToggle />
        </View>
      </View>

      {!!banner && (
        <LinearGradient
          colors={[...gradients.banner]}
          style={styles.banner}
          accessibilityLabel={banner.name}
        >
          <Image
            source={banner.imageUrl}
            style={styles.bannerImage}
            contentFit="cover"
            // Artwork is 2.02:1 in a 2.25:1 frame — crop from the bottom, as Figma does.
            contentPosition="top center"
            transition={300}
          />
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  masthead: { backgroundColor: colors.brandHeader, paddingBottom: spacing.md },

  appBar: {
    height: layout.appBarHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  appBarRight: { flexDirection: "row", alignItems: "center", gap: spacing.xl },

  location: { flexShrink: 1, gap: spacing.xs },
  locationRow: { flexDirection: "row", alignItems: "center", gap: spacing.xxs },
  locationTitle: { ...type.titleLg, color: colors.text, flexShrink: 1 },
  locationSub: { ...type.metaRegular, color: colors.text },

  vegToggle: { alignItems: "center", gap: spacing.xs },
  vegLabel: {
    ...type.meta,
    fontFamily: type.cardTitle.fontFamily,
    color: colors.text,
  },
  vegTrack: {
    width: VEG_SWITCH.width,
    height: VEG_SWITCH.height,
    borderRadius: radii.pill,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  vegKnob: {
    width: VEG_SWITCH.knob,
    height: VEG_SWITCH.knob,
    borderRadius: radii.pill,
    backgroundColor: colors.onBrand,
  },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.brandRing,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { ...type.cardTitle, color: colors.brand },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  searchPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: layout.searchHeight,
    paddingLeft: spacing.xxl,
    paddingRight: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 43,
  },
  searchText: { ...type.body, color: colors.textMuted },

  priceMode: {
    width: TOGGLE.width,
    height: TOGGLE.height,
    borderRadius: radii.pill,
    backgroundColor: colors.track,
    justifyContent: "center",
  },
  priceModeKnob: {
    position: "absolute",
    left: TOGGLE.inset,
    width: TOGGLE.knob,
    height: TOGGLE.height - TOGGLE.inset * 2,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  priceModeText: { ...type.micro, color: colors.textSecondary, lineHeight: 13 },
  priceModeState: {
    position: "absolute",
    ...type.micro,
    color: colors.textSecondary,
  },
  stateLeft: { left: 10 },
  stateRight: { right: 10 },

  banner: {
    height: layout.bannerHeight,
    borderBottomLeftRadius: radii.hero,
    borderBottomRightRadius: radii.hero,
    overflow: "hidden",
  },
  bannerImage: { width: "100%", height: "100%" },
});
