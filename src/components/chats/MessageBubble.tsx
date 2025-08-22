import { type Message } from "@/types";
import { Reply } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface MessageBubbleProps {
    message: Message;
    isSentByCurrentUser: boolean;
    onMessageSelect: (msg: Message) => void;
}

const MessageBubble = ({ message, isSentByCurrentUser, onMessageSelect }: MessageBubbleProps) => {
    const { user } = useAuthStore();
    const alignment = isSentByCurrentUser ? 'justify-end ml-auto' : 'justify-start mr-auto';

    const bubbleStyles = isSentByCurrentUser
        ? 'bg-midnight text-white'
        : 'bg-sky-blue text-black';

    return (
        <div className={`w-1/2 flex ${alignment} gap-2`}>
            <div className="flex flex-col">
                {
                    message.replyingTo &&
                    <div className={message.replyingTo.originalSenderName === user?.displayName ? " bg-gray-200 p-2 rounded-t-lg text-xs" : " bg-sky-blue text-white p-2 rounded-t-lg text-xs"}>
                        <p>{message.replyingTo.originalMessageText.length > 200 ? message.replyingTo.originalMessageText.slice(0, 200) + "..." : message.replyingTo.originalMessageText}</p>
                    </div>
                }
                <div className={`max-w-xs lg:max-w-md px-4 py-2 ${bubbleStyles} ${message.replyingTo ? " rounded-b-lg" : " rounded-lg"}`}>
                    <p>{message.text}</p>
                    <p className={`text-xs mt-2 text-right ${isSentByCurrentUser ? 'text-sky-200' : 'text-gray-500'}`}>
                        {message.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
            <button onClick={() => onMessageSelect(message)}>
                <Reply />
            </button>
        </div>
    );
};

export default MessageBubble;