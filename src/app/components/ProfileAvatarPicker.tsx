import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { colors, icons } from "@/theme/tokens";

type AppStyles = typeof import("@/theme/styles").styles;

type ProfileAvatarPickerProps = {
  uri: string | null;
  username: string;
  onPress: () => void;
  styles: AppStyles;
};

export function ProfileAvatarPicker({
  uri,
  username,
  onPress,
  styles,
}: ProfileAvatarPickerProps) {
  const initials =
    username
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "A";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Choose profile picture"
      onPress={onPress}
      style={styles.avatarButton}
    >
      {uri ? (
        <Image source={{ uri }} contentFit="cover" style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>
      )}
      <View style={styles.cameraBadge}>
        <Text style={[styles.cameraIcon, { color: colors.white }]}>{icons.add}</Text>
      </View>
    </Pressable>
  );
}
