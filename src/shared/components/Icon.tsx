import { Text, TextStyle } from "react-native";

import { icons } from "@/theme/tokens";

type IconName = keyof typeof icons;

export function Icon({ name, style }: { name: IconName; style?: TextStyle }) {
  return <Text style={style}>{icons[name]}</Text>;
}
