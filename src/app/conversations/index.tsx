import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useConversationStore } from "@/store/conversation-store";
import { useProfileStore } from "@/store/profile-store";
import { Button } from "@/shared/components/Button";
import { AppText } from "@/shared/components/Text";
import { colors, spacing } from "@/theme/tokens";
import { useStyles } from "@/theme/useStyles";
import Avatar from "../components/Avatar";
import ConversationListItem from "../components/ConversationListItem";
import Icon from "@/shared/components/Icon";

export default function Home() {
  const insets = useSafeAreaInsets();
  const { styles, isDark: isDarkMode } = useStyles();
  const [query, setQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const conversations = useConversationStore((state) => state.conversations);
  const hasHydrated = useConversationStore((state) => state.hasHydrated);
  const loadError = useConversationStore((state) => state.loadError);
  const markAsRead = useConversationStore((state) => state.markAsRead);
  const username = useProfileStore((state) => state.username);
  const avatarUri = useProfileStore((state) => state.avatarUri);
  const profileHasHydrated = useProfileStore((state) => state.hasHydrated);
  const redirectAttemptedRef = useRef(false);

  useEffect(() => {
    if (!profileHasHydrated || username.trim() || redirectAttemptedRef.current) {
      return;
    }

    redirectAttemptedRef.current = true;
    router.replace({
      pathname: "/profile",
      params: { onboarding: "true" },
    } as never);
  }, [profileHasHydrated, username]);

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      `${conversation.name} ${conversation.preview}`.toLowerCase().includes(normalizedQuery),
    );
  }, [conversations, query]);

  async function refreshConversations() {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    setIsRefreshing(false);
  }

  if (!profileHasHydrated || !username.trim()) {
    return (
      <View style={[styles.screen, styles.loadingScreen, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.stateText}>Preparing your space...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, isDarkMode && styles.darkScreen, { paddingTop: insets.top }]}>
      <View style={[styles.header, { paddingHorizontal: spacing.large }]}>
        <View>
          <Text style={styles.eyebrow}>CHAT BUDDY</Text>
          <Text style={[styles.title, isDarkMode && styles.darkText]}>Messages</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={() => router.push("/profile" as never)}
        >
          <Avatar
            uri={avatarUri}
            size={40}
            containerStyle={styles.profileAvatar}
            imageStyle={styles.profileAvatar}
          />
        </Pressable>
      </View>

      <View style={[styles.searchWrap, isDarkMode && styles.darkSearchWrap]}>
        <Icon name="search" size={22} color={colors.textMuted} />
        <TextInput
          accessibilityLabel="Search conversations"
          placeholder="Search conversations"
          placeholderTextColor={colors.textFaint}
          value={query}
          onChangeText={setQuery}
          style={[styles.searchInput, isDarkMode && styles.darkText]}
          returnKeyType="search"
        />
        {query ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => setQuery("")}
          >
            <Icon name="close" size={22} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {conversations?.length ? (
        <View style={styles.listHeader}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>Chats</Text>
          <Text style={styles.count}>{filteredConversations.length}</Text>
        </View>
      ) : null}

      {loadError ? <Text style={styles.listErrorText}>{loadError}</Text> : null}

      {!hasHydrated ? (
        <View style={styles.stateBox}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.stateText}>Gathering your conversations...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 24 }]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshConversations}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <ConversationListItem
              item={item}
              isDark={isDarkMode}
              styles={styles}
              onPress={() => {
                markAsRead(item.id);
                router.push(`/conversations/${item.id}` as never);
              }}
            />
          )}
          ListEmptyComponent={
            <View style={styles.stateBox}>
              <Icon name="chat-bubble-outline" size={52} color={colors.primary} />
              <AppText style={[styles.emptyTitle, isDarkMode && styles.darkText]}>
                {query ? "No chats found" : "No conversations yet"}
              </AppText>
              <AppText style={styles.stateText}>
                {query
                  ? "Try a different name or message."
                  : "Your new conversations will appear here."}
              </AppText>
              {!query ? (
                <Button
                  accessibilityRole="button"
                  accessibilityLabel="Start a new chat"
                  onPress={() => router.push("/conversations/new-chat" as never)}
                  style={styles.emptyActionButton}
                >
                  <AppText style={styles.emptyActionText}>Start New Chat</AppText>
                </Button>
              ) : null}
            </View>
          }
        />
      )}
      {conversations?.length ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start a new chat"
          onPress={() => router.push("/conversations/new-chat" as never)}
          style={({ pressed }) => [
            styles.newChatButton,
            { bottom: Math.max(insets.bottom, spacing.medium) + spacing.small },
            pressed && styles.conversationPressed,
          ]}
        >
          <Icon name="add" size={28} color={colors.white} />
        </Pressable>
      ) : null}
    </View>
  );
}
