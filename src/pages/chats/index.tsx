import ConversationList from "@/components/chats/ConversationList";
import ConversationView from "@/components/chats/ConversationView";
import { useState } from "react";
import type { Conversation } from "@/types"

const ChatsPage = () => {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    return (
        <div className="flex flex-grow">
            <div className={`
                ${selectedConversation ? 'hidden' : 'flex'}
                lg:flex w-full lg:w-[30%]
            `}>
                <ConversationList
                    onConversationSelect={(conversation) => setSelectedConversation(conversation)}
                    selectedConversation={selectedConversation}
                />
            </div>
            <div className={`
                ${selectedConversation ? 'flex' : 'hidden'}
                lg:flex w-full lg:w-[70%]
            `}>
                <ConversationView
                    conversation={selectedConversation}
                    onBack={() => setSelectedConversation(null)}
                />
            </div>
        </div>
    )
}

export default ChatsPage;