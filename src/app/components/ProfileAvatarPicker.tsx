import { Image } from "expo-image";
import { Pressable, View } from "react-native";

import Icon from "@/shared/components/Icon";
import { colors } from "@/theme/tokens";

const noUserImage = require("../../../assets/images/no-user.png");

type AppStyles = typeof import("@/theme/styles").styles;

type ProfileAvatarPickerProps = {
  uri: string | null;
  onPress: () => void;
  styles: AppStyles;
};

export default function ProfileAvatarPicker({ uri, onPress, styles }: ProfileAvatarPickerProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Choose profile picture"
      onPress={onPress}
      style={styles.avatarButton}
    >
      <Image source={uri ? { uri } : noUserImage} contentFit="cover" style={styles.avatarImage} />
      <View style={styles.cameraBadge}>
        <Icon name="add" size={24} color={colors.white} />
      </View>
    </Pressable>
  );
}
