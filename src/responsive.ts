import { useWindowDimensions } from "react-native";
import { layout, spacing } from "./theme";

export function useResponsiveLayout() {
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, layout.maxContentWidth);
  const columns =
    contentWidth >= layout.threeColumnsAt
      ? 3
      : contentWidth >= layout.twoColumnsAt
        ? 2
        : 1;
  const gutters = layout.screenPadding * 2 + spacing.lg * (columns - 1);

  return {
    contentWidth,
    columns,
    cardWidth: (contentWidth - gutters) / columns,
  };
}
