import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Message } from "@/shared/mockdata/messages";
import { ActionSheetModal } from "@/shared/components/ActionSheetModal";
import { useConversationStore } from "@/store/conversation-store";
import { useMessageStore } from "@/store/message-store";
import { colors } from "@/theme/tokens";
import { useStyles } from "@/theme/useStyles";
import Avatar from "../components/Avatar";
import Icon from "@/shared/components/Icon";

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
  const [isConversationMenuVisible, setIsConversationMenuVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
  const conversations = useConversationStore((state) => state.conversations);
  const markAsRead = useConversationStore((state) => state.markAsRead);
  const updatePreview = useConversationStore((state) => state.updatePreview);
  const removeConversation = useConversationStore((state) => state.removeConversation);
  const addMessage = useMessageStore((state) => state.addMessage);
  const addAttachment = useMessageStore((state) => state.addAttachment);
  const removeMessage = useMessageStore((state) => state.removeMessage);
  const clearMessages = useMessageStore((state) => state.clearMessages);
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

  function closeMessageOptions() {
    setSelectedMessageId(null);
  }

  async function openAttachment(message: Message) {
    if (!message.attachmentUri) return;
    if (message.kind === "image") {
      setPreviewImageUri(message.attachmentUri);
      return;
    }
    await Linking.openURL(message.attachmentUri);
  }

  function addPickedAttachment(uri: string, name: string, mimeType?: string) {
    const message = addAttachment(conversationId, {
      text: "",
      kind: "image",
      attachmentUri: uri,
      attachmentName: name,
      attachmentMimeType: mimeType,
    });
    updatePreview(conversationId, `image: ${name}`);
    markAsRead(conversationId);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    return message;
  }

  async function chooseImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: true,
      quality: 0.85,
    });
    if (!result.canceled) {
      result.assets.forEach((asset) => {
        addPickedAttachment(asset.uri, asset.fileName ?? "Image", asset.mimeType);
      });
    }
  }

  function openFriendProfile() {
    router.push({
      pathname: "/profile/user",
      params: {
        name: conversation?.name ?? "",
        username: conversation?.username ?? "",
        avatarUri: conversation?.avatarUri ?? "",
      },
    } as never);
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
          <Icon
            name="arrow-back"
            size={24}
            color={isDarkMode ? colors.darkText : colors.textStrong}
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open profile for ${conversation.name}`}
          onPress={openFriendProfile}
          style={styles.conversationProfile}
        >
          <Avatar online={conversation.online} size={40} uri={conversation.avatarUri} />
          <View style={styles.headerInfo}>
            <Text style={[styles.name, isDarkMode && styles.darkText]}>{conversation.name}</Text>
            <Text style={styles.status}>{conversation.online ? "Active now" : "Offline"}</Text>
          </View>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open conversation details"
          onPress={() => setIsConversationMenuVisible(true)}
          style={styles.moreButton}
        >
          <Icon name="more-horiz" size={24} color={colors.textMuted} />
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
                <Pressable
                  accessibilityRole={item.kind ? "button" : undefined}
                  accessibilityLabel={item.kind ? `Open ${item.kind} attachment` : undefined}
                  onLongPress={() => setSelectedMessageId(item.id)}
                  onPress={() => {
                    if (item.kind) void openAttachment(item);
                  }}
                  style={styles.messagePressable}
                >
                  <View
                    style={[
                      styles.bubble,
                      item.kind && styles.attachmentBubble,
                      item.sender === "me" ? styles.myBubble : styles.theirBubble,
                    ]}
                  >
                    {item.kind && item.kind !== "text" ? (
                      item.kind === "image" ? (
                        <View>
                          <Image
                            source={{ uri: item.attachmentUri }}
                            contentFit="cover"
                            style={styles.attachmentImage}
                          />
                          <Text
                            numberOfLines={1}
                            style={[styles.attachmentName, styles.attachmentImageName]}
                          >
                            {item.attachmentName}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.attachmentPreview}>
                          <Icon
                            name={item.kind === "audio" ? "audiotrack" : "insert-drive-file"}
                            size={30}
                            color={item.sender === "me" ? colors.white : colors.primary}
                            style={styles.attachmentIcon}
                          />
                          <View>
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.attachmentName,
                                item.sender === "me" ? styles.myMessageText : styles.messageText,
                              ]}
                            >
                              {item.attachmentName}
                            </Text>
                            <Text
                              style={[
                                styles.attachmentType,
                                item.sender === "me" ? styles.myMessageText : styles.time,
                              ]}
                            >
                              {item.kind.toUpperCase()}
                            </Text>
                          </View>
                        </View>
                      )
                    ) : (
                      <Text
                        style={[styles.messageText, item.sender === "me" && styles.myMessageText]}
                      >
                        {item.text}
                      </Text>
                    )}
                  </View>
                </Pressable>
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
          accessibilityLabel="Add attachment"
          onPress={() => void chooseImage()}
          style={styles.attachButton}
        >
          <Icon name="photo-library" size={24} color={colors.textMuted} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Send message"
          disabled={!draft.trim()}
          onPress={sendMessage}
          style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
        >
          <Icon name="send" size={22} color={colors.white} />
        </Pressable>
      </View>
      <ActionSheetModal
        visible={selectedMessageId !== null}
        title="Delete message"
        options={[
          {
            label: "Delete for everyone",
            icon: "delete",
            onPress: () => {
              if (selectedMessageId) removeMessage(conversationId, selectedMessageId);
              closeMessageOptions();
            },
          },
          {
            label: "Delete for me",
            icon: "delete-outline",
            onPress: () => {
              if (selectedMessageId) removeMessage(conversationId, selectedMessageId);
              closeMessageOptions();
            },
          },
        ]}
        onCancel={closeMessageOptions}
      />
      <Modal
        animationType="fade"
        onRequestClose={() => setPreviewImageUri(null)}
        transparent
        visible={previewImageUri !== null}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close image preview"
          onPress={() => setPreviewImageUri(null)}
          style={styles.mediaViewer}
        >
          {previewImageUri ? (
            <Image
              source={{ uri: previewImageUri }}
              contentFit="contain"
              style={styles.mediaViewerImage}
            />
          ) : null}
        </Pressable>
      </Modal>
      <ActionSheetModal
        visible={isConversationMenuVisible}
        title={`Options for ${conversation.name}`}
        options={[
          {
            label: "Block",
            icon: "block",
            onPress: () => setIsConversationMenuVisible(false),
          },
          {
            label: "Archive",
            icon: "archive",
            onPress: () => setIsConversationMenuVisible(false),
          },
          {
            label: "Delete",
            icon: "delete",
            onPress: () => {
              removeConversation(conversation.id);
              setIsConversationMenuVisible(false);
              router.replace("/conversations" as never);
            },
          },
          {
            label: "Clear chat messages",
            icon: "clear-all",
            onPress: () => {
              clearMessages(conversation.id);
              setIsConversationMenuVisible(false);
            },
          },
        ]}
        onCancel={() => setIsConversationMenuVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}
