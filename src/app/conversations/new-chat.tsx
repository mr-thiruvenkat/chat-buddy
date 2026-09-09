import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { developmentUsername, initialConversations } from "@/shared/mockdata/conversations";
import { useConversationStore } from "@/store/conversation-store";
import { colors } from "@/theme/tokens";
import { useStyles } from "@/theme/useStyles";
import Avatar from "../components/Avatar";
import Icon from "@/shared/components/Icon";

export default function NewChatScreen() {
  const insets = useSafeAreaInsets();
  const { styles, isDark: isDarkMode } = useStyles();
  const [username, setUsername] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const contentScrollRef = useRef<ScrollView>(null);
  const addConversation = useConversationStore((state) => state.addConversation);
  const conversations = useConversationStore((state) => state.conversations);

  const normalizedUsername = username.trim().replace(/^@/, "").toLowerCase();
  const match = useMemo(
    () =>
      initialConversations.find(
        (conversation) =>
          conversation.username === developmentUsername &&
          conversation.username === normalizedUsername,
      ),
    [normalizedUsername],
  );
  const alreadyAdded = match
    ? conversations.some((conversation) => conversation.id === match.id)
    : false;

  function findUser() {
    Keyboard.dismiss();
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
          <Icon name="arrow-back" size={24} color={colors.textStrong} />
        </Pressable>
        <Text style={[styles.headerTitle, isDarkMode && styles.darkText]}>New chat</Text>
        <View style={styles.headerSide} />
      </View>

      <ScrollView
        ref={contentScrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
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
            onFocus={() => {
              requestAnimationFrame(() =>
                contentScrollRef.current?.scrollTo({ y: 150, animated: true }),
              );
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
              <Avatar size={54} uri={match.avatarUri} />
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
