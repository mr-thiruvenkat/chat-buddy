export type DeliveryState = "sending" | "sent" | "read";
export type Message = {
  id: string;
  conversationId: string;
  text: string;
  sender: "me" | "them";
  createdAt: string;
  delivery: DeliveryState;
};

export const initialMessages: Record<string, Message[]> = {
  maya: [
    {
      id: "maya-1",
      conversationId: "maya",
      text: "Hey! Are you still up for the market tomorrow?",
      sender: "them",
      createdAt: "2026-09-07T08:58:00.000Z",
      delivery: "read",
    },
    {
      id: "maya-2",
      conversationId: "maya",
      text: "Absolutely. I found a little coffee spot nearby too.",
      sender: "me",
      createdAt: "2026-09-07T09:11:00.000Z",
      delivery: "read",
    },
    {
      id: "maya-3",
      conversationId: "maya",
      text: "That sounds perfect. See you tomorrow!",
      sender: "them",
      createdAt: "2026-09-07T09:42:00.000Z",
      delivery: "read",
    },
  ],
  jordan: [
    {
      id: "jordan-1",
      conversationId: "jordan",
      text: "I sent over the photos from the hike.",
      sender: "them",
      createdAt: "2026-09-06T16:30:00.000Z",
      delivery: "read",
    },
  ],
  samira: [
    {
      id: "samira-1",
      conversationId: "samira",
      text: "Are we still on for coffee this week?",
      sender: "them",
      createdAt: "2026-09-01T10:12:00.000Z",
      delivery: "read",
    },
  ],
  "weekend-crew": [
    {
      id: "weekend-crew-1",
      conversationId: "weekend-crew",
      text: "Noah: I can bring the snacks.",
      sender: "them",
      createdAt: "2026-08-31T14:05:00.000Z",
      delivery: "read",
    },
  ],
};
