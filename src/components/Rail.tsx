/** Horizontal section: heading + card row. Shared by the restaurant rails. */
import { ScrollView, StyleSheet, View } from "react-native";
import { SectionHeader } from "./primitives";
import { layout, spacing } from "../theme";

export function Rail({
  title,
  seeAll,
  children,
}: {
  title: string;
  seeAll?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View>
      <SectionHeader title={title} seeAll={seeAll} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing.xxs,
    gap: spacing.md,
  },
});
