import Constants, { AppOwnership } from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import type { RelativePathString } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProfileAvatarPicker } from "@/app/components/ProfileAvatarPicker";
import { SettingRow } from "@/app/components/SettingRow";
import { UsernameInputField } from "@/app/components/UsernameInputField";
import { useProfileStore } from "@/store/profile-store";
import { colors } from "@/theme/tokens";
import { useStyles } from "@/theme/useStyles";

const usernamePattern = /^[a-zA-Z0-9._-]+$/;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { styles, isDark: isDarkMode } = useStyles();
  const { onboarding } = useLocalSearchParams<{ onboarding?: string }>();
  const username = useProfileStore((state) => state.username);
  const avatarUri = useProfileStore((state) => state.avatarUri);
  const notificationsEnabled = useProfileStore((state) => state.notificationsEnabled);
  const setProfile = useProfileStore((state) => state.setProfile);
  const setThemeMode = useProfileStore((state) => state.setThemeMode);
  const setNotificationsEnabled = useProfileStore((state) => state.setNotificationsEnabled);
  const hasHydrated = useProfileStore((state) => state.hasHydrated);
  const isOnboarding = onboarding === "true" || !username.trim();
  const [draftUsername, setDraftUsername] = useState(username);
  const [draftAvatarUri, setDraftAvatarUri] = useState(avatarUri);
  const [error, setError] = useState<string | null>(null);

  async function chooseAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo access needed", "Allow photo access to choose a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setDraftAvatarUri(result.assets[0].uri);
    }
  }

  function saveProfile() {
    const trimmedUsername = draftUsername.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 24) {
      setError("Username must be between 3 and 24 characters.");
      return;
    }
    if (!usernamePattern.test(trimmedUsername)) {
      setError("Use letters, numbers, dots, hyphens, or underscores only.");
      return;
    }

    setProfile({ username: trimmedUsername, avatarUri: draftAvatarUri });
    if (isOnboarding) {
      router.replace("/conversations" as RelativePathString);
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/conversations" as RelativePathString);
  }

  function cancelChanges() {
    setDraftUsername(username);
    setDraftAvatarUri(avatarUri);
    setError(null);

    if (isOnboarding || !username.trim()) {
      router.replace("/conversations" as RelativePathString);
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/conversations" as RelativePathString);
  }

  async function toggleNotifications(enabled: boolean) {
    if (!enabled) {
      setNotificationsEnabled(false);
      return;
    }

    const isExpoGo = Constants.appOwnership === AppOwnership.Expo;
    if (Platform.OS === "web" || isExpoGo) {
      setNotificationsEnabled(true);
      if (isExpoGo) {
        Alert.alert(
          "Saved for this session",
          "Notification permissions require a development build on Android Expo Go.",
        );
      }
      return;
    }

    const Notifications = await import("expo-notifications");
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("messages", {
        name: "Messages",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const permission = await Notifications.requestPermissionsAsync();
    if (
      permission.granted ||
      permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    ) {
      setNotificationsEnabled(true);
    } else {
      Alert.alert(
        "Notifications are off",
        "Allow notifications in your device settings to turn them on.",
      );
    }
  }

  const themeMode = useProfileStore((state) => state.themeMode);

  if (!hasHydrated) {
    return <View style={[styles.screen, { paddingTop: insets.top }]} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.screen, isDarkMode && styles.darkScreen, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        {isOnboarding ? (
          <View style={styles.headerSide} />
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel profile editing"
            onPress={cancelChanges}
          >
            <Text style={styles.cancel}>Cancel</Text>
          </Pressable>
        )}
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>
          {isOnboarding ? "Create your profile" : "Edit profile"}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save profile"
          onPress={saveProfile}
        >
          <Text style={styles.save}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <ProfileAvatarPicker
          uri={draftAvatarUri}
          username={draftUsername}
          onPress={() => void chooseAvatar()}
          styles={styles}
        />

        {isOnboarding ? (
          <Text style={styles.intro}>Choose a username so friends know it&apos;s you.</Text>
        ) : null}

        <UsernameInputField
          value={draftUsername}
          onChangeText={(value) => {
            setDraftUsername(value);
            setError(null);
          }}
          error={error}
          isDark={isDarkMode}
          styles={styles}
        />

        {!isOnboarding ? (
          <View style={styles.settingsSection}>
            <Text style={styles.label}>PREFERENCES</Text>
            <SettingRow
              label="Appearance"
              subtitle={isDarkMode ? "Dark mode" : "Light mode"}
              isDark={isDarkMode}
              styles={styles}
            >
              <View style={styles.modeToggle}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Use light mode"
                  onPress={() => setThemeMode("light")}
                  style={[styles.modeOption, themeMode === "light" && styles.activeModeOption]}
                >
                  <Text style={[styles.modeText, themeMode === "light" && styles.activeModeText]}>
                    Light
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Use dark mode"
                  onPress={() => setThemeMode("dark")}
                  style={[styles.modeOption, themeMode === "dark" && styles.activeModeOption]}
                >
                  <Text style={[styles.modeText, themeMode === "dark" && styles.activeModeText]}>
                    Dark
                  </Text>
                </Pressable>
              </View>
            </SettingRow>
            <SettingRow
              label="Notifications"
              subtitle={notificationsEnabled ? "Allowed" : "Not allowed"}
              isDark={isDarkMode}
              styles={styles}
            >
              <Switch
                accessibilityLabel="Allow notifications"
                onValueChange={(value) => void toggleNotifications(value)}
                trackColor={{ false: colors.borderInput, true: colors.primarySoft }}
                thumbColor={notificationsEnabled ? colors.primary : colors.white}
                value={notificationsEnabled}
              />
            </SettingRow>
          </View>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}
