import { PropsWithChildren } from "react";
import { Pressable, PressableProps } from "react-native";

export function Button({ children, style, ...props }: PropsWithChildren<PressableProps>) {
  return (
    <Pressable {...props} style={style}>
      {children}
    </Pressable>
  );
}
