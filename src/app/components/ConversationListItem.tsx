import { Pressable, Text, View } from "react-native";

import { Conversation } from "@/shared/mockdata/conversations";
import Avatar from "./Avatar";

type AppStyles = typeof import("@/theme/styles").styles;

type ConversationListItemProps = {
  item: Conversation;
  isDark: boolean;
  styles: AppStyles;
  onPress: () => void;
};

export default function ConversationListItem({
  item,
  isDark,
  styles,
  onPress,
}: ConversationListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open chat with ${item.name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.conversation, pressed && styles.conversationPressed]}
    >
      <Avatar
        initials={item.initials}
        color={item.color}
        online={item.online}
        size={54}
        textStyle={styles.avatarText}
      />
      <View style={styles.conversationBody}>
        <View style={styles.rowBetween}>
          <Text
            style={[
              styles.name,
              isDark && styles.darkText,
              item.unread > 0 && styles.unreadName,
            ]}
          >
            {item.name}
          </Text>
          <Text style={[styles.timestamp, item.unread > 0 && styles.unreadTimestamp]}>
            {item.timestamp}
          </Text>
        </View>
        <View style={styles.rowBetween}>
          <Text numberOfLines={1} style={[styles.preview, item.unread > 0 && styles.unreadPreview]}>
            {item.preview}
          </Text>
          {item.unread > 0 ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
