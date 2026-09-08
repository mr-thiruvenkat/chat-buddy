# Chat Buddy — High-Level Design (HLD)

## 1. Overview
Chat Buddy is a cross-platform messaging application built with Expo Router and React Native. It is designed to help users manage personal conversations, open chat threads, send messages, and maintain a profile with a username and profile picture. The app is intentionally local-first and optimized for a clean user experience across mobile and web.

The product focuses on a usable chat flow without depending on a production backend. Instead, it stores conversations, messages, and profile state locally in device storage so the experience feels real and persistent while remaining easy to replace with a real time-service layer later.

## 2. Business Objective
The goal of Chat Buddy is to provide a convenient, friendly, and polished messaging experience for people who want to:

- create a profile quickly
- browse recent chats
- open a thread and review history
- send messages with a lightweight composer
- keep all state available after app restarts

## 3. Target Users
- Individual users managing personal conversations
- Friends or small groups represented by searchable contacts and chat threads
- Users who expect a simple, mobile-first messaging workflow

## 4. Core Features
### 4.1 Profile Management
- Onboarding flow that requires a valid username before accessing chat features
- Username validation with length and character restrictions
- Profile picture selection from the device library
- Fallback avatar generation using initials when no image is set
- Support for light/dark appearance preference and notification toggle

### 4.2 Conversation Discovery
- Conversation list with avatars and names
- Latest message preview and timestamps
- Unread indicators and search/filter support
- Ability to start a new chat or reopen an existing thread
- Empty state and loading state handling

### 4.3 Messaging Experience
- Thread-based conversation view with readable message chronology
- Message grouping by sender for visually clean chat rhythm
- Inbound and outbound message styling
- Composer with send button and safe keyboard behavior
- Message persistence and preview updates

### 4.4 New Chat Creation
- Search by username to find a friend or contact
- Match result card with profile summary
- Add conversation and open directly into the thread

### 4.5 Local Persistence
- Profile data is retained across app restarts
- Conversations and messages remain available after reload
- Hydration states prevent premature empty UI before data is restored

## 5. High-Level Architecture
### 5.1 Navigation Layer
The app uses Expo Router with file-based routes to structure the experience:

- home/conversation list
- conversation detail route
- new chat route
- profile route

This keeps navigation simple and aligned with the application flow.

### 5.2 UI Layer
Screens are composed of reusable components such as:

- avatar components
- list items
- profile picker
- username input
- settings rows
- theme-aware shared styling helpers

The UI is built to work consistently across iOS, Android, and web without requiring major platform-specific branching.

### 5.3 State Management Layer
The application uses Zustand to manage app state in a typed and predictable way. State is split into multiple stores:

- profile store for username, avatar, theme, and notification settings
- conversation store for chat list metadata and unread status
- message store for message history by conversation ID

This separation keeps screen logic readable and reduces the risk of cross-feature state coupling.

### 5.4 Persistence Layer
Data persistence is implemented through AsyncStorage with a small adapter service. Zustand persistence middleware serializes the relevant state to local storage and restores it on app startup.

This gives the application a realistic offline/local-first behavior without introducing a backend dependency.

### 5.5 Shared Domain Layer
The project includes mock conversation and message data as seeded domain objects. These act as the content source for the app and provide a base for future replacement with a real API or realtime service.

## 6. Functional Flow
### 6.1 First Launch
- App checks whether a username exists
- If not, user is redirected to the profile onboarding screen
- User enters a valid username and optionally picks a profile image
- Data is stored locally and used across the app

### 6.2 Reading Messages
- User opens the conversation list
- Each row shows contact name, latest preview, and time
- Selecting a chat opens the thread and marks it as read
- Message history is displayed in chronological order

### 6.3 Sending Messages
- User types into the composer
- Empty or whitespace values are rejected
- The message is appended to the current conversation history
- Conversation preview updates to show the new message
- Thread scrolls to the newest message after sending

### 6.4 Editing the Profile
- User opens profile settings
- Draft updates are held locally until save
- Save validates username format and applies the updates
- Cancel restores the previous values and exits the editor

## 7. Data Model
### Profile
- username: string
- avatarUri: string | null
- themeMode: "light" | "dark"
- notificationsEnabled: boolean

### Conversation
- id: string
- name: string
- username: string
- initials: string
- color: string
- preview: string
- timestamp: string
- unread: number
- online: boolean

### Message
- id: string
- conversationId: string
- text: string
- sender: "me" | "them"
- createdAt: string
- delivery: "sent" | "read"

## 8. Design Considerations
### User Experience
- Clean hierarchy with visible headers, quick actions, and content density tuned for chat
- Readable message spacing and sender grouping to improve flow comprehension
- Search, empty states, and loading indicators to make the app feel intentional and robust

### Reliability
- Input validation prevents invalid usernames and blank sends
- Hydration guards protect screens before persisted state is restored
- Local storage is treated as a real persistence boundary instead of a mock only

### Extensibility
- The data access layer is isolated from screen rendering
- A real chat backend can replace the local adapter without redesigning the screens
- The architecture supports future realtime integration, richer notification logic, and user directory services

## 9. Assumptions and Constraints
- The current app is a local-first demo rather than a full production realtime chat platform
- Message delivery state is represented locally rather than confirmed by a backend service
- Notification permissions are handled carefully based on platform capability and Expo environment
- “Friend discovery” is implemented using local mock contact data and username matching rather than a live user directory

## 10. Summary
Chat Buddy is a polished, local-first messaging application designed around a simple but complete chat workflow: profile onboarding, conversation discovery, thread viewing, message sending, and persistent state retention. Its architecture separates UI, state management, and storage in a way that is easy to understand, scalable, and ready for future backend or realtime integration.
