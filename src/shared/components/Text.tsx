import { PropsWithChildren } from "react";
import { Text as NativeText, StyleProp, TextProps, TextStyle } from "react-native";

export function AppText({
  children,
  style,
  ...props
}: PropsWithChildren<TextProps & { style?: StyleProp<TextStyle> }>) {
  return (
    <NativeText {...props} style={style}>
      {children}
    </NativeText>
  );
}
