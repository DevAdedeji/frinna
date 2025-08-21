import { type Message } from "@/types";

interface MessageBubbleProps {
    message: Message;
    isSentByCurrentUser: boolean;
}

const MessageBubble = ({ message, isSentByCurrentUser }: MessageBubbleProps) => {
    const alignment = isSentByCurrentUser ? 'justify-end' : 'justify-start';

    const bubbleStyles = isSentByCurrentUser
        ? 'bg-midnight text-white'
        : 'bg-sky-blue text-black';

    return (
        <div className={`w-full flex ${alignment}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${bubbleStyles}`}>
                <p>{message.text}</p>
                <p className={`text-xs mt-2 text-right ${isSentByCurrentUser ? 'text-sky-200' : 'text-gray-500'}`}>
                    {message.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
};

export default MessageBubble;