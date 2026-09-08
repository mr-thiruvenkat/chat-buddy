import { TextInput, TextInputProps } from "react-native";

import { useStyles } from "@/theme/useStyles";

export function Input(props: TextInputProps) {
  const { styles } = useStyles();
  return <TextInput {...props} style={[styles.input, props.style]} />;
}
