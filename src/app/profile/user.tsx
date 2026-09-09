import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/tokens";
import { useStyles } from "@/theme/useStyles";
import Icon from "@/shared/components/Icon";

const noUserImage = require("../../../assets/images/no-user.png");

export default function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const { styles, isDark: isDarkMode } = useStyles();
  const { name, username, avatarUri } = useLocalSearchParams<{
    name?: string;
    username?: string;
    avatarUri?: string;
  }>();

  return (
    <View style={[styles.screen, isDarkMode && styles.darkScreen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={colors.textStrong} />
        </Pressable>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>Profile</Text>
        <View style={styles.headerSide} />
      </View>
      <View style={styles.userProfileContent}>
        <Image
          source={avatarUri ? { uri: avatarUri } : noUserImage}
          contentFit="cover"
          style={styles.userProfileImage}
        />
        <Text style={[styles.userProfileName, isDarkMode && styles.darkText]}>{name}</Text>
        <Text style={styles.userProfileUsername}>@{username}</Text>
      </View>
    </View>
  );
}
