import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { initialMessages, Message } from "@/shared/mockdata/messages";
import { storage } from "@/services/storage";

type MessageState = {
  messagesByConversation: Record<string, Message[]>;
  hasHydrated: boolean;
  addMessage: (conversationId: string, text: string) => Message | null;
  addAttachment: (
    conversationId: string,
    attachment: Omit<Message, "id" | "conversationId" | "sender" | "createdAt" | "delivery">,
  ) => Message;
  removeMessage: (conversationId: string, messageId: string) => void;
  clearMessages: (conversationId: string) => void;
  setHasHydrated: (value: boolean) => void;
};

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      messagesByConversation: initialMessages,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      addMessage: (conversationId, text) => {
        const cleanText = text.trim();
        if (!cleanText) return null;
        const message: Message = {
          id: `${conversationId}-${Date.now()}`,
          conversationId,
          text: cleanText,
          sender: "me",
          createdAt: new Date().toISOString(),
          delivery: "sent",
        };
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: [...(state.messagesByConversation[conversationId] ?? []), message],
          },
        }));
        return message;
      },
      clearMessages: (conversationId) =>
        set((state) => ({
          messagesByConversation: { ...state.messagesByConversation, [conversationId]: [] },
        })),
      addAttachment: (conversationId, attachment) => {
        const message: Message = {
          ...attachment,
          id: `${conversationId}-${Date.now()}`,
          conversationId,
          sender: "me",
          createdAt: new Date().toISOString(),
          delivery: "sent",
        };
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: [...(state.messagesByConversation[conversationId] ?? []), message],
          },
        }));
        return message;
      },
      removeMessage: (conversationId, messageId) =>
        set((state) => ({
          messagesByConversation: {
            ...state.messagesByConversation,
            [conversationId]: (state.messagesByConversation[conversationId] ?? []).filter(
              (message) => message.id !== messageId,
            ),
          },
        })),
    }),
    {
      name: "chat-buddy-messages",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ messagesByConversation: state.messagesByConversation }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
