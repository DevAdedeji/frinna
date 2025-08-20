import ConversationList from "@/components/chats/ConversationList";
import ConversationView from "@/components/chats/ConversationView";
import { useState } from "react";

const ChatsPage = () => {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    return (
        <div className="flex flex-grow">
            <div className={`
                ${selectedConversationId ? 'hidden' : 'flex'}
                lg:flex w-full lg:w-[30%]
            `}>
                <ConversationList
                    onConversationSelect={(id) => setSelectedConversationId(id)}
                    selectedConversationId={selectedConversationId}
                />
            </div>
            <div className={`
                ${selectedConversationId ? 'flex' : 'hidden'}
                lg:flex w-full lg:w-[70%]
            `}>
                <ConversationView
                    conversationId={selectedConversationId}
                    onBack={() => setSelectedConversationId(null)}
                />
            </div>
        </div>
    )
}

export default ChatsPage;