import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from "@expo-google-fonts/figtree";

import { useHomeFeed } from "./src/hooks/useHomeFeed";
import { HomeScreen } from "./src/screens/HomeScreen";
import {
  ErrorState,
  HomeSkeleton,
  NotServiceable,
} from "./src/components/states";
import { colors, layout } from "./src/theme";

function Root() {
  const { state, reload } = useHomeFeed();

  if (state.status === "ready") return <HomeScreen feed={state.feed} />;

  return (
    <SafeAreaView style={styles.root} edges={["top", "bottom"]}>
      {state.status === "loading" && <HomeSkeleton />}
      {state.status === "blocked" && (
        <NotServiceable
          serviceability={state.serviceability}
          onRetry={reload}
        />
      )}
      {state.status === "error" && (
        <ErrorState message={state.message} onRetry={reload} />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style="dark" />
        {/* Hold the splash-coloured shell until Figtree is ready, so no frame
            renders in the system font. */}
        <View style={styles.frame}>
          {fontsLoaded ? <Root /> : <View style={styles.root} />}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  frame: {
    flex: 1,
    width: "100%",
    maxWidth: layout.maxContentWidth,
    alignSelf: "center",
  },
});
