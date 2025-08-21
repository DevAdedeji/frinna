import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, PlusIcon } from "lucide-react"
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuthStore } from "@/store/useAuthStore";
import { db } from "@/firebase";
import { collection, where, limit, query, orderBy, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import NewConversationModal from "./NewConversationModal";
import type { Conversation, ParticipantInfo } from "@/types"

interface ConversationListProps {
    onConversationSelect: (conversation: Conversation) => void;
    selectedConversation: Conversation | null;
}


const ConversationList = ({ onConversationSelect, selectedConversation }: ConversationListProps) => {

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);

    const [openNewConversation, setOpenNewConversation] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.uid) return;

        if (!user) {
            setConversations([]);
            setIsLoading(false);
            return;
        }


        setIsLoading(true);
        const conversationsRef = collection(db, "conversations");
        const q = query(
            conversationsRef,
            where("participants", "array-contains", user.uid),
            orderBy("lastMessageTimestamp", "desc"),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const convos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Conversation[];
            setConversations(convos);
            setFilteredConversations(convos);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (searchTerm.length > 0) {
            const fConversations = conversations.filter(conv => {
                const recipient = getRecipientInfo(conv);
                if (recipient?.displayName.toLowerCase().includes(searchTerm.toLowerCase())) {
                    return conv;
                }
            })
            setFilteredConversations(fConversations)
        } else {
            setFilteredConversations(conversations);
        }
    }, [searchTerm])

    const getRecipientInfo = (conversation: Conversation): ParticipantInfo | null => {
        const recipentId = conversation.participants.find(con => con !== user?.uid);

        if (recipentId) {
            return conversation.participantInfo[recipentId];
        }
        return null;
    }

    const showConversations = useMemo(() => {
        return !isLoading && conversations.length
    }, [conversations])


    return (
        <div className="w-full flex flex-col gap-4 bg-background max-h-[90vh] py-4 sm:py-10 px-4 sm:px-9 overflow-y-hidden">
            <div className="flex items-center gap-2">
                <Button variant="secondary" className="!p-0 !size-[35px]" onClick={() => navigate(-1)}>
                    <ChevronLeft className="!text-base" />
                </Button>
                <p className="ubuntu-font font-bold text-3xl text-charcoal ">Chats</p>
            </div>
            <Input placeholder="Search friends" ringColor="ring-charcoal" className="mt-4" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <div className="w-full flex h-full flex-col overflow-y-auto no-scrollbar relative">
                {
                    isLoading && conversations.length === 0 ?
                        (
                            <div className="flex flex-col gap-4">
                                <div className="h-10 bg-gray-300 rounded-md w-full"></div>
                                <div className="h-10 bg-gray-300 rounded-md w-full"></div>
                                <div className="h-10 bg-gray-300 rounded-md w-full"></div>
                                <div className="h-10 bg-gray-300 rounded-md w-full"></div>
                                <div className="h-10 bg-gray-300 rounded-md w-full"></div>
                                <div className="h-10 bg-gray-300 rounded-md w-full"></div>
                                <div className="h-10 bg-gray-300 rounded-md w-full"></div>
                                <div className="h-10 bg-gray-300 rounded-md w-full"></div>
                                <div className="h-10 bg-gray-300 rounded-md w-full"></div>
                            </div>
                        )
                        :
                        (
                            null
                        )
                }
                {
                    showConversations &&
                    filteredConversations.map((conversation, index) => {
                        const recipient = getRecipientInfo(conversation);
                        return (
                            <button type="button" key={index} className={"w-full  flex justify-between py-5" + (index === filteredConversations.length - 1 ? " border-none" : " border-b border-background") + (selectedConversation === conversation ? "bg-sky-200" : "bg-transparent")} onClick={() => onConversationSelect(conversation)}>
                                <div className="flex items-center gap-2">
                                    <div className="size-[50px] rounded-full flex items-center justify-center">
                                        {
                                            recipient?.photoURL ?
                                                <img src={recipient.photoURL} alt="User Avatar" className="rounded-full w-full h-full object-cover" />
                                                :
                                                <div className="w-full h-full bg-gray-300 rounded-full text-center flex items-center justify-center text-xl uppercase">
                                                    {recipient?.displayName[0]}
                                                </div>
                                        }
                                    </div>
                                    <div className="flex flex-col gap-1 text-left">
                                        <p className="text-base font-semibold capitalize">{recipient?.displayName}</p>
                                        <p className="text-sm text-charcoal-65">{conversation.lastMessageText || "No messages yet"}</p>
                                    </div>
                                </div>
                                <p className="text-charcoal-65 text-xs">{conversation.lastMessageTimestamp?.toDate().toLocaleDateString()}</p>
                            </button>
                        )
                    })
                }

                <button className="absolute right-2 bottom-2 flex items-center justify-center bg-midnight text-white rounded-full size-11" onClick={() => setOpenNewConversation(true)}>
                    <PlusIcon />
                </button>
            </div>
            <NewConversationModal isOpen={openNewConversation} onClose={() => setOpenNewConversation(false)} />
        </div>
    );
}

export default ConversationList;
