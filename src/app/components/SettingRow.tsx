import { ReactNode } from "react";
import { Text, View } from "react-native";

type AppStyles = typeof import("@/theme/styles").styles;

type SettingRowProps = {
  label: string;
  subtitle: string;
  isDark: boolean;
  styles: AppStyles;
  children: ReactNode;
};

export default function SettingRow({ label, subtitle, isDark, styles, children }: SettingRowProps) {
  return (
    <View style={[styles.settingRow, isDark && styles.darkSettingRow]}>
      <View style={styles.settingCopy}>
        <Text style={[styles.settingTitle, isDark && styles.darkText]}>{label}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}
