import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Conversation, initialConversations } from "@/shared/mockdata/conversations";
import { storage } from "@/services/storage";

type ConversationState = {
  conversations: Conversation[];
  hasHydrated: boolean;
  loadError: string | null;
  setHasHydrated: (value: boolean) => void;
  setLoadError: (value: string | null) => void;
  markAsRead: (id: string) => void;
  updatePreview: (id: string, preview: string) => void;
  addConversation: (conversation: Conversation) => void;
  clearConversations: () => void;
  removeConversation: (id: string) => void;
};

export const useConversationStore = create<ConversationState>()(
  persist(
    (set) => ({
      conversations: initialConversations,
      hasHydrated: false,
      loadError: null,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setLoadError: (loadError) => set({ loadError }),
      markAsRead: (id) =>
        set((state) => ({
          conversations: state.conversations.map((item) =>
            item.id === id ? { ...item, unread: 0 } : item,
          ),
        })),
      updatePreview: (id, preview) =>
        set((state) => ({
          conversations: state.conversations.map((item) =>
            item.id === id ? { ...item, preview, timestamp: "Now" } : item,
          ),
        })),
      addConversation: (conversation) =>
        set((state) => ({
          conversations: state.conversations.some((item) => item.id === conversation.id)
            ? state.conversations
            : [conversation, ...state.conversations],
        })),
      clearConversations: () => set({ conversations: [] }),
      removeConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "chat-buddy-conversations",
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({ conversations: state.conversations }),
      onRehydrateStorage: () => (state, error) => {
        state?.setHasHydrated(true);
        state?.setLoadError(error ? "Your conversations could not be loaded." : null);
      },
    },
  ),
);
