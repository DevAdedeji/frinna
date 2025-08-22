import { QueryDocumentSnapshot, type DocumentData, type Timestamp } from "firebase/firestore";

interface ReplyTo {
    originalMessageId: string,
    originalSenderName: string,
    originalMessageText: string,
}

export interface Message {
    id?: string;
    senderId: string;
    text: string;
    createdAt: Timestamp;
    isRead?: boolean;
    replyingTo?: ReplyTo
}

export interface ParticipantInfo {
    displayName: string;
    photoURL?: string
}

export interface Conversation {
    id: string,
    participants: string[],
    participantInfo: {
        [key: string]: ParticipantInfo
    },
    messages: Message[],
    lastMessageText: string;
    lastMessageSenderId: string,
    lastMessageTimestamp: Timestamp,
    lastMessageIsRead: boolean,
}

export interface ConversationsPageState {
    isLoading: boolean;
    error: string | null;
    conversations: Conversation[];
    hasMore: boolean;
    lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}

export interface UserProfile {
    createdAt: Timestamp,
    email: string,
    id: string,
    username: string,
    photoURL?: string,
}