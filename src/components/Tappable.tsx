/**
 * Every tappable surface in the app. Pressable already tracks press state and
 * hands it to the style callback, so this adds the shared feedback and nothing
 * else — no animation machinery per instance.
 */
import { Pressable, type PressableProps, type ViewStyle } from "react-native";

const PRESSED_OPACITY = 0.92;

type Props = PressableProps & { style?: ViewStyle | ViewStyle[] };

export function Tappable({ style, children, ...rest }: Props) {
  return (
    <Pressable
      {...rest}
      style={({ pressed }) => [style, pressed && { opacity: PRESSED_OPACITY }]}
    >
      {children as React.ReactNode}
    </Pressable>
  );
}
