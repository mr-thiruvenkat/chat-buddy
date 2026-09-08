import { styles } from "@/theme/styles";
import { useTheme } from "@/theme/ThemeContext";

export function useStyles() {
  const { isDark } = useTheme();
  return { styles, isDark };
}
