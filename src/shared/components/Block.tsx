import { PropsWithChildren } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

export function Block({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={style}>{children}</View>;
}
