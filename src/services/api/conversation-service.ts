import { Conversation, developmentUsername } from "@/shared/mockdata/conversations";

export type ConversationService = {
  searchByUsername: (username: string) => Promise<Conversation | null>;
};

export const localConversationService: ConversationService = {
  async searchByUsername(username) {
    const normalized = username.trim().replace(/^@/, "").toLowerCase();
    const { initialConversations } = await import("@/shared/mockdata/conversations");
    return normalized === developmentUsername
      ? (initialConversations.find((conversation) => conversation.username === normalized) ?? null)
      : null;
  },
};
