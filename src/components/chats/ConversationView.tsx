import { ChevronLeft } from "lucide-react";
import Button from "../ui/Button";
import type { Conversation, ParticipantInfo, Message } from "@/types"
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useMemo, useState, useRef } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import MessageBubble from "./MessageBubble";
import Input from "../ui/Input";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ConversationViewProps {
    conversation: Conversation | null;
    onBack: () => void;
}

interface FormInput {
    message: string,
}

const ConversationView = ({ conversation, onBack }: ConversationViewProps) => {
    const { user } = useAuthStore();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInput>();

    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false);
    const [fetchingMessages, setFetchingMessages] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getRecipientInfo = useMemo((): ParticipantInfo | null => {
        if (conversation) {
            const recipentId = conversation.participants.find(con => con !== user?.uid);

            if (recipentId) {
                return conversation.participantInfo[recipentId];
            }
            return null;
        }
        return null;
    }, [conversation])

    const onSubmit = async (data: FormInput) => {
        if (!user || !conversation) {
            throw new Error("User not found")
        }
        try {
            setLoading(true);
            const toastId = toast.loading("Sending your message...");
            const conversationRef = doc(db, "conversations", conversation.id);
            const messagesRef = collection(db, "conversations", conversation?.id, "messages");
            await addDoc(messagesRef, {
                text: data.message,
                senderId: user.uid,
                createdAt: serverTimestamp()
            });
            await updateDoc(conversationRef, {
                lastMessageTimestamp: serverTimestamp(),
                lastMessageText: data.message,
                lastMessageSenderId: user.uid,
            })
            reset({
                message: ""
            })
            toast.success("Message sent!", { id: toastId });
        } catch (e: any) {
            toast.error(e.message || "An error occurred")
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (!conversation?.id) return;
        setFetchingMessages(true);
        const messagesRef = collection(db, "conversations", conversation.id, "messages");
        const q = query(messagesRef, orderBy("createdAt"));
        const unsubscribe = onSnapshot(q, (querySnapShot) => {
            const msgs = querySnapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Message[];
            setMessages(msgs);
            setFetchingMessages(false);
        })
        return () => unsubscribe();
    }, [conversation])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!conversation) {
        return (
            <div className="bg-white cnview-shadow w-full h-full flex items-center justify-center">
                <p className="text-center uppercase text-charcoal w-1/2 mx-auto ubuntu-font font-bold text-4xl">
                    CLICK ON A MESSAGE TO VIEW
                </p>
            </div>
        );
    }
    return (
        <div className="w-full bg-white cnview-shadow max-h-[90vh] overflow-hidden flex py-4 sm:py-10 px-4 sm:px-9 flex-col">
            <div className="flex items-center gap-2">
                <Button variant="secondary" className="!p-0 !size-[35px]" onClick={onBack}>
                    <ChevronLeft className="!text-base" />
                </Button>
                <div className="flex-grow">
                    <p className="font-bold capitalize">Chat with {getRecipientInfo?.displayName}</p>
                </div>
            </div>
            <div className="flex-grow h-full pt-4 px-4 overflow-y-auto flex flex-col gap-4 relative no-scrollbar">
                {
                    fetchingMessages && messages.length === 0 ?
                        (
                            <div className="flex items-center justify-center text-center h-full">
                                <p className="text-midnight text-2xl font-semibold">Fetching messages...</p>
                            </div>
                        )

                        : (
                            null
                        )
                }
                {
                    messages.length > 0 &&
                    messages.map(message => {
                        const isSentByCurrentUser = message.senderId === user?.uid;
                        return (
                            <MessageBubble
                                key={message.id}
                                message={message}
                                isSentByCurrentUser={isSentByCurrentUser}
                            />
                        )
                    })
                }
                <div ref={messagesEndRef} />
            </div>
            <form className="w-full flex items-center gap-2 flex-shrink-0 px-4 py-2 bg-white" onSubmit={handleSubmit(onSubmit)}>
                <Input placeholder="Type your message..." ringColor="ring-midnight" className="w-full" {...register("message", { required: "Message is required" })} error={errors.message?.message} />
                <button className="uppercase text-mdidnight font-bold" disabled={loading}>send</button>
            </form>
        </div>
    )
}

export default ConversationView;