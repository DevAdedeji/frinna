import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { ChevronLeft, PlusIcon } from "lucide-react"
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuthStore } from "@/store/useAuthStore";
import { db } from "@/firebase";
import { collection, where, limit, query, getDocs, startAfter } from "firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import NewConversationModal from "./NewConversationModal";
import type { Conversation, ConversationsPageState, ParticipantInfo } from "@/types"

interface ConversationListProps {
    onConversationSelect: (conversation: Conversation) => void;
    selectedConversation: Conversation | null;
}


const ConversationList = ({ onConversationSelect, selectedConversation }: ConversationListProps) => {

    const [pageState, setPageState] = useState<ConversationsPageState>({
        isLoading: false,
        error: null,
        conversations: [],
        hasMore: true,
        lastVisible: null,
    })

    const [openNewConversation, setOpenNewConversation] = useState(false);

    const { user } = useAuthStore();
    const navigate = useNavigate();

    const fetchConversations = useCallback(async () => {
        if (pageState.isLoading || !user || !pageState.hasMore) {
            return
        }
        setPageState(prev => ({ ...prev, isLoading: true }));
        try {
            const conversationsRef = collection(db, "conversations");
            let q;
            if (pageState.lastVisible) {
                q = query(conversationsRef, where("participants", "array-contains", user.uid), limit(10), startAfter(pageState.lastVisible))
            } else {
                q = query(conversationsRef, where("participants", "array-contains", user.uid), limit(10))
            }
            const querySnapshot = await getDocs(q);
            const newConversations = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Conversation[];
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            setPageState(prev => ({
                ...prev,
                isLoading: false,
                hasMore: newConversations.length === 10,
                lastVisible: lastDoc,
                conversations: [...prev.conversations, ...newConversations],
            }));
        } catch (e: any) {
            const errorMessage = e.message ?? "An unknown error occurred.";
            toast.error(errorMessage);
            setPageState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
        }
    }, [])

    const observer = useRef<IntersectionObserver | null>(null);

    const lastConversationRef = useCallback((node: HTMLButtonElement | null) => {
        if (pageState.isLoading) {
            return
        }
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && pageState.hasMore) {
                fetchConversations()
            }
        })

        if (node) observer.current.observe(node)
    }, [pageState.isLoading, pageState.hasMore, fetchConversations]);

    const initialFetchDone = useRef(false);
    useEffect(() => {
        if (initialFetchDone.current) {
            return;
        }
        initialFetchDone.current = true;
        fetchConversations()
    }, [fetchConversations])

    const handleConversationCreated = () => {
        setOpenNewConversation(false);
        fetchConversations();
    }

    const getRecipientInfo = (conversation: Conversation): ParticipantInfo | null => {
        const recipentId = conversation.participants.find(con => con !== user?.uid);

        if (recipentId) {
            return conversation.participantInfo[recipentId];
        }
        return null;
    }

    const showConversations = useMemo(() => {
        return !pageState.isLoading && pageState.conversations.length
    }, [pageState.conversations])


    return (
        <div className="w-full flex flex-col gap-4 bg-background max-h-[90vh] py-4 sm:py-10 px-4 sm:px-9 overflow-y-hidden">
            <div className="flex items-center gap-2">
                <Button variant="secondary" className="!p-0 !size-[35px]" onClick={() => navigate(-1)}>
                    <ChevronLeft className="!text-base" />
                </Button>
                <p className="ubuntu-font font-bold text-3xl text-charcoal ">Chats</p>
            </div>
            <Input placeholder="Search conversation" ringColor="ring-charcoal" className="mt-4" />
            <div className="w-full flex h-full flex-col overflow-y-auto no-scrollbar relative">
                {
                    pageState.isLoading && pageState.conversations.length === 0 ?
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
                    pageState.conversations.map((conversation, index) => {
                        const recipient = getRecipientInfo(conversation);
                        return (
                            <button type="button" key={index} ref={index === pageState.conversations.length - 1 ? lastConversationRef : null} className={"w-full  flex justify-between py-5" + (index === pageState.conversations.length - 1 ? " border-none" : " border-b border-grey") + (selectedConversation === conversation ? "bg-sky-200" : "bg-transparent")} onClick={() => onConversationSelect(conversation)}>
                                <div className="flex items-center gap-2">
                                    <div className="size-[50px] rounded-full flex items-center justify-center">
                                        {
                                            recipient?.photoURL ?
                                                <img src={recipient.photoURL} alt="User Avatar" className="rounded-full w-full h-full object-cover" />
                                                :
                                                <div className="w-full h-full bg-gray-300 rounded-full text-center"></div>
                                        }
                                    </div>
                                    <div className="flex flex-col gap-1 text-left">
                                        <p className="text-base font-semibold capitalize">{recipient?.displayName}</p>
                                        <p className="text-sm text-charcoal-65">{conversation.lastMessageText || "No messages yet"}</p>
                                    </div>
                                </div>
                                <p className="text-charcoal-65 text-xs">{conversation.lastMessageTimestamp.toDate().toLocaleDateString()}</p>
                            </button>
                        )
                    })
                }

                <button className="absolute right-2 bottom-2 flex items-center justify-center bg-midnight text-white rounded-full size-11" onClick={() => setOpenNewConversation(true)}>
                    <PlusIcon />
                </button>
            </div>
            <NewConversationModal isOpen={openNewConversation} onClose={() => setOpenNewConversation(false)} onConversationCreated={handleConversationCreated} />
        </div>
    );
}

export default ConversationList;