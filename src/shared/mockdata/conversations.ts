export type Conversation = {
  id: string;
  name: string;
  username: string;
  initials: string;
  color: string;
  preview: string;
  timestamp: string;
  unread: number;
  online: boolean;
};

export const initialConversations: Conversation[] = [
  {
    id: "maya",
    name: "Maya Chen",
    username: "maya.chen",
    initials: "MC",
    color: "#D9A441",
    preview: "That sounds perfect. See you tomorrow!",
    timestamp: "9:42 AM",
    unread: 2,
    online: true,
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    username: "jordanlee",
    initials: "JL",
    color: "#D66B58",
    preview: "I sent over the photos from the hike.",
    timestamp: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "samira",
    name: "Samira Patel",
    username: "samira.p",
    initials: "SP",
    color: "#6C8C73",
    preview: "Are we still on for coffee this week?",
    timestamp: "Mon",
    unread: 1,
    online: true,
  },
  {
    id: "weekend-crew",
    name: "Weekend crew",
    username: "weekend-crew",
    initials: "WC",
    color: "#6D78B5",
    preview: "Noah: I can bring the snacks.",
    timestamp: "Sun",
    unread: 0,
    online: false,
  },
];
