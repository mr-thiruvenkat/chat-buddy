import { PropsWithChildren } from "react";
import { Pressable, PressableProps, Text } from "react-native";

import { useStyles } from "@/theme/useStyles";

export function Button({ children, style, ...props }: PropsWithChildren<PressableProps>) {
  const { styles } = useStyles();
  return (
    <Pressable {...props} style={style}>
      <Text style={styles.findButtonText}>{children}</Text>
    </Pressable>
  );
}
