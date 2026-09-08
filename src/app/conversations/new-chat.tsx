import { router } from "expo-router";
import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { initialConversations } from "@/shared/mockdata/conversations";
import { useConversationStore } from "@/store/conversation-store";
import { colors, icons } from "@/theme/tokens";
import { useStyles } from "@/theme/useStyles";

export default function NewChatScreen() {
  const insets = useSafeAreaInsets();
  const { styles, isDark: isDarkMode } = useStyles();
  const [username, setUsername] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const addConversation = useConversationStore((state) => state.addConversation);
  const conversations = useConversationStore((state) => state.conversations);

  const normalizedUsername = username.trim().replace(/^@/, "").toLowerCase();
  const match = useMemo(
    () => initialConversations.find((conversation) => conversation.username === normalizedUsername),
    [normalizedUsername],
  );
  const alreadyAdded = match
    ? conversations.some((conversation) => conversation.id === match.id)
    : false;

  function findUser() {
    setHasSearched(true);
  }

  function openConversation() {
    if (!match) {
      return;
    }

    addConversation(match);
    router.replace(`/conversations/${match.id}` as never);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.screen, isDarkMode && styles.darkScreen, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close new chat"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>{icons.back}</Text>
        </Pressable>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>New chat</Text>
        <View style={styles.headerSide} />
      </View>

      <View style={styles.content}>
        <Text style={styles.eyebrow}>START A CONVERSATION</Text>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          Who would you like to message?
        </Text>
        <Text style={styles.subtitle}>Search by their username to find a friend.</Text>

        <View style={styles.searchRow}>
          <Text style={styles.atSign}>@</Text>
          <TextInput
            accessibilityLabel="Friend username"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            onChangeText={(value) => {
              setUsername(value);
              setHasSearched(false);
            }}
            onSubmitEditing={findUser}
            placeholder="username"
            placeholderTextColor={colors.textFaint}
            returnKeyType="search"
            style={[styles.input, isDarkMode && styles.darkInput]}
            value={username}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Find user"
          disabled={!normalizedUsername}
          onPress={findUser}
          style={[styles.findButton, !normalizedUsername && styles.disabledButton]}
        >
          <Text style={styles.findButtonText}>Find user</Text>
        </Pressable>

        {hasSearched ? (
          match ? (
            <Pressable
              accessibilityRole="button"
              onPress={openConversation}
              style={styles.resultCard}
            >
              <View style={[styles.avatar, { backgroundColor: match.color }]}>
                <Text style={styles.avatarText}>{match.initials}</Text>
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{match.name}</Text>
                <Text style={styles.resultUsername}>@{match.username}</Text>
              </View>
              <Text style={styles.resultAction}>{alreadyAdded ? "Open" : "Chat"}</Text>
            </Pressable>
          ) : (
            <View style={styles.noResult}>
              <Text style={styles.noResultTitle}>Username not found</Text>
              <Text style={styles.noResultText}>Check the spelling and try again.</Text>
            </View>
          )
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}
