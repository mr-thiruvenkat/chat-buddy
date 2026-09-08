import { Text, TextInput, View } from "react-native";

import { colors } from "@/theme/tokens";

type AppStyles = typeof import("@/theme/styles").styles;

type UsernameInputFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  error: string | null;
  isDark: boolean;
  styles: AppStyles;
};

export default function UsernameInputField({
  value,
  onChangeText,
  error,
  isDark,
  styles,
}: UsernameInputFieldProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>USERNAME</Text>
      <View
        style={[styles.inputWrap, isDark && styles.darkInput, error && styles.inputError]}
      >
        <Text style={styles.atSign}>@</Text>
        <TextInput
          accessibilityLabel="Username"
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={24}
          onChangeText={onChangeText}
          placeholder="your username"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
          value={value}
        />
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Text style={styles.helper}>This is how friends will find you.</Text>
      )}
    </View>
  );
}
