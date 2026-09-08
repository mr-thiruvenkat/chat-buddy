import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { initialMessages, Message } from "@/shared/mockdata/messages";
import { storage } from "@/services/storage";

type MessageState = {
  messagesByConversation: Record<string, Message[]>;
  hasHydrated: boolean;
  addMessage: (conversationId: string, text: string) => Message | null;
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
    }),
    {
      name: "chat-buddy-messages",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ messagesByConversation: state.messagesByConversation }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
