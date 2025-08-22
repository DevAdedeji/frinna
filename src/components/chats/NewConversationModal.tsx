import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import TextArea from "../ui/TextArea";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query, where, serverTimestamp, writeBatch, doc } from "firebase/firestore";
import { db } from "@/firebase";
import toast from "react-hot-toast";
import useDebounce from "@/hooks/useDebounce";
import { useAuthStore } from "@/store/useAuthStore";
import { X } from 'lucide-react';
import type { UserProfile } from "@/types"


interface NewConversationModalProps {
    isOpen: boolean,
    onClose: () => void,
}

const NewConversationModal = ({ isOpen, onClose }: NewConversationModalProps) => {
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recipient, setRecipient] = useState<UserProfile | null>(null);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const { user } = useAuthStore();

    const onUserSelect = (user: UserProfile) => {
        setRecipient(user);
        setSearchResults([]);
        setSearchTerm('');
    }

    useEffect(() => {
        const fetchUsers = async () => {
            if (debouncedSearchTerm.length === 0) {
                setSearchResults([])
                return;
            }
            setIsLoading(true);
            try {
                const usernamesRef = collection(db, "users");
                let q = query(usernamesRef, where("username", ">=", debouncedSearchTerm.toLowerCase()), where("username", "<=", debouncedSearchTerm.toLowerCase() + '\uf8ff'), limit(10))
                const querySnapshot = await getDocs(q);
                const users = querySnapshot.docs.map(user => ({
                    ...user.data(),
                })) as UserProfile[];
                setSearchResults(users);
            } catch (e: any) {
                toast.error(e.message || "An error occured")
            } finally {
                setIsLoading(false)
            }

        }
        fetchUsers()
    }, [debouncedSearchTerm])

    const handleSendMessage = async () => {
        if (!message.trim()) {
            throw new Error("Message is empty")
        }
        if (!recipient) {
            throw new Error("Recipent not selected")
        }
        if (!user) {
            return
        }
        try {
            setSending(true);
            let conversationId: string;
            let conversationRef;
            const wb = writeBatch(db);
            const participants = [user.uid, recipient.id];
            const conversationsRef = collection(db, "conversations");
            const q = query(conversationsRef, where("participants", "==", participants));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                conversationRef = doc(collection(db, "conversations"));
                conversationId = conversationRef.id;
                const newConversationData = {
                    participants,
                    participantInfo: {
                        [user.uid]: {
                            displayName: user.displayName || "Unknown",
                            photoURL: user.photoURL || "",
                        },
                        [recipient.id]: {
                            displayName: recipient.username,
                            photoURL: recipient.photoURL || "",
                        }
                    },
                    lastMessageTimestamp: serverTimestamp(),
                    lastMessageText: message,
                    lastMessageSenderId: user.uid,
                    lastMessageIsRead: false,
                }
                wb.set(conversationRef, newConversationData);
                const messageRef = doc(collection(db, "conversations", conversationId, "messages"));
                wb.set(messageRef, {
                    text: message,
                    senderId: user.uid,
                    createdAt: serverTimestamp(),
                });
                await wb.commit();
                toast.success("Conversation started successfully")
                setRecipient(null);
                setMessage("");
                onClose();
            }
        } catch (e: any) {
            toast.error(e.message || "An error occured")
        } finally {
            setSending(false);
        }
    }

    return (
        <Modal title="Start a new conversation" isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col relative">
                    {
                        !recipient ?
                            (
                                <Input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search user by username" aria-label="Search users" autoComplete="off" />
                            )
                            :
                            (
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">To:</p>
                                        <button
                                            onClick={() => setRecipient(null)}
                                            className="text-gray-400 hover:text-gray-600"
                                            aria-label="Close modal"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {
                                            recipient.photoURL ?
                                                (
                                                    <img src={recipient.photoURL} alt="recipient Avatar" className="rounded-full size-7 object-cover" />
                                                ) :
                                                (
                                                    <div className="size-7 bg-gray-300 rounded-full text-center flex items-center uppercase justify-center">{recipient.username[0]}</div>
                                                )
                                        }
                                        <p className="capitalize">{recipient.username}</p>
                                    </div>
                                </div>
                            )
                    }
                    {
                        isLoading &&
                        (
                            <div className="bg-gray-200 border border-grey flex flex-col gap-2 p-3 rounded-b-2xl">
                                <div className="h-10 bg-gray-300 rounded-md w-full"></div>
                                <div className="h-10 bg-gray-300 rounded-md w-full"></div>
                            </div>
                        )
                    }
                    {
                        searchResults.length > 0 && !isLoading ?
                            (
                                <div className="bg-gray-200 border border-grey flex flex-col gap-2 p-3 rounded-b-2xl min-h-[50px] max-h-[200px] overflow-hidden">
                                    <div className="overflow-y-auto h-full">
                                        {
                                            searchResults.map(user => (
                                                <button key={user.id} className="w-full flex items-center gap-2 py-1" onClick={() => onUserSelect(user)}>
                                                    {
                                                        user.photoURL ?
                                                            (
                                                                <img src={user.photoURL} alt="User Avatar" className="rounded-full size-7 object-cover" />
                                                            ) :
                                                            (
                                                                <div className="size-7 bg-gray-300 rounded-full text-center flex items-center justify-center uppercase">{user.username[0]}</div>
                                                            )
                                                    }
                                                    <p className="capitalize">{user.username}</p>
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                            :
                            (
                                null
                            )
                    }
                </div>
                <TextArea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" autoComplete="off" />
                <Button type="submit" onClick={handleSendMessage} disabled={sending}>Send Message</Button>
            </div>
        </Modal>
    )
}

export default NewConversationModal;