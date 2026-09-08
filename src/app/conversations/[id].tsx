import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Message } from "@/shared/mockdata/messages";
import { useConversationStore } from "@/store/conversation-store";
import { useMessageStore } from "@/store/message-store";
import { colors, icons } from "@/theme/tokens";
import { useStyles } from "@/theme/useStyles";

function formatTime(createdAt: string) {
  return new Date(createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function ConversationScreen() {
  const insets = useSafeAreaInsets();
  const { styles, isDark: isDarkMode } = useStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const conversationId = Array.isArray(id) ? id[0] : id;
  const listRef = useRef<FlatList<Message>>(null);
  const [draft, setDraft] = useState("");
  const conversations = useConversationStore((state) => state.conversations);
  const markAsRead = useConversationStore((state) => state.markAsRead);
  const updatePreview = useConversationStore((state) => state.updatePreview);
  const addMessage = useMessageStore((state) => state.addMessage);
  const hasHydrated = useMessageStore((state) => state.hasHydrated);
  const messages = useMessageStore((state) => state.messagesByConversation[conversationId] ?? []);
  const conversation = useMemo(
    () => conversations.find((item) => item.id === conversationId),
    [conversationId, conversations],
  );

  function sendMessage() {
    const message = addMessage(conversationId, draft);
    if (!message) {
      return;
    }

    setDraft("");
    updatePreview(conversationId, message.text);
    markAsRead(conversationId);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }

  if (!conversation) {
    return (
      <View
        style={[
          styles.screen,
          isDarkMode && styles.darkScreen,
          styles.centered,
          { paddingTop: insets.top },
        ]}
      >
        <Text style={styles.missingTitle}>Conversation unavailable</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.screen, isDarkMode && styles.darkScreen, { paddingTop: insets.top }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
    >
      <View style={[styles.header, isDarkMode && styles.darkHeader]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.backHitbox}
        >
          <Text style={styles.backIcon}>{icons.back}</Text>
        </Pressable>
        <View style={[styles.avatar, { backgroundColor: conversation.color }]}>
          <Text style={styles.avatarText}>{conversation.initials}</Text>
          {conversation.online ? <View style={styles.onlineDot} /> : null}
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.name, isDarkMode && styles.darkText]}>{conversation.name}</Text>
          <Text style={styles.status}>{conversation.online ? "Active now" : "Offline"}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open conversation details"
          style={styles.moreButton}
        >
          <Text style={styles.moreText}>{icons.more}</Text>
        </Pressable>
      </View>

      {!hasHydrated ? (
        <View style={styles.centered}>
          <Text style={styles.stateText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={[styles.messageList, messages.length === 0 && styles.emptyList]}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item, index }: { item: Message; index: number }) => {
            const previous = messages[index - 1];
            const grouped = previous?.sender === item.sender;
            return (
              <View
                style={[
                  styles.messageRow,
                  item.sender === "me" && styles.myMessageRow,
                  grouped && styles.groupedMessage,
                ]}
              >
                {item.sender === "them" ? (
                  <Text style={styles.senderLabel}>{grouped ? "" : conversation.name}</Text>
                ) : null}
                <View
                  style={[
                    styles.bubble,
                    item.sender === "me" ? styles.myBubble : styles.theirBubble,
                  ]}
                >
                  <Text style={[styles.messageText, item.sender === "me" && styles.myMessageText]}>
                    {item.text}
                  </Text>
                </View>
                <View style={styles.messageMeta}>
                  <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
                  {item.sender === "me" ? (
                    <Text style={styles.delivery}>
                      {item.delivery === "read" ? "Read" : "Sent"}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View>
              <Text style={styles.emptyTitle}>Start the conversation</Text>
              <Text style={styles.stateText}>Send a message to {conversation.name}.</Text>
            </View>
          }
        />
      )}

      <View
        style={[
          styles.composerWrap,
          isDarkMode && styles.darkHeader,
          { paddingBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <TextInput
          accessibilityLabel="Message"
          multiline
          onChangeText={setDraft}
          onSubmitEditing={sendMessage}
          placeholder="Write a message..."
          placeholderTextColor={colors.textFaint}
          returnKeyType="send"
          style={[styles.composer, isDarkMode && styles.darkComposer]}
          value={draft}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send message"
          disabled={!draft.trim()}
          onPress={sendMessage}
          style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
        >
          <Text style={styles.sendIcon}>{icons.send}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
