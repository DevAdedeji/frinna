import { db } from "@/firebase";
import { collection, getDocs, query, limit, where, type Timestamp, QueryDocumentSnapshot, type DocumentData, startAfter, orderBy } from "firebase/firestore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import toast from "react-hot-toast";

interface AnonMessageData {
    id: string,
    recipientId: string,
    messageText: string,
    isRead: boolean,
    isArchived: boolean,
    createdAt: Timestamp,
}

interface MessagesPageState {
    isLoading: boolean;
    error: string | null;
    messages: AnonMessageData[];
    hasMore: boolean,
    lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}


const MessagesPage = () => {
    const { user } = useAuthStore();
    const [pageState, setPageState] = useState<MessagesPageState>({
        isLoading: false,
        error: null,
        messages: [],
        lastVisible: null,
        hasMore: true,
    });
    const fetchAllMesages = useCallback(async () => {
        if (!pageState.hasMore || !user) {
            return;
        }
        if (pageState.isLoading) {
            return;
        }
        setPageState(prev => ({ ...prev, isLoading: true }));
        try {
            const anonMessagesRef = collection(db, "anonymous_messages");
            let q;
            if (pageState.lastVisible) {
                q = query(anonMessagesRef, where("recipientId", "==", user.uid), orderBy("createdAt", "desc"), startAfter(pageState.lastVisible), limit(10));
            } else {
                q = query(anonMessagesRef, where("recipientId", "==", user.uid), orderBy("createdAt", "desc"), limit(10))
            }
            const querySnapshot = await getDocs(q);
            const newMessages = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AnonMessageData[];
            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
            setPageState(prev => ({
                ...prev,
                isLoading: false,
                messages: [...prev.messages, ...newMessages],
                lastVisible: lastDoc || null,
                hasMore: newMessages.length === 10,
            }));

        } catch (e: any) {
            const errorMessage = e.message ?? "An unknown error occurred.";
            toast.error(errorMessage);
            setPageState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
        }
    }, [user, pageState.hasMore, pageState.lastVisible, pageState.isLoading])

    const showMessages = useMemo(() => {
        return pageState.messages.length > 0 && !pageState.isLoading;
    }, [pageState.messages]);

    const initialFetchDone = useRef(false);
    useEffect(() => {
        if (initialFetchDone.current || !user) {
            return;
        }
        initialFetchDone.current = true;
        fetchAllMesages();
    }, [fetchAllMesages, user])

    const observer = useRef<IntersectionObserver | null>(null);
    const lastMessageRef = useCallback((node: HTMLDivElement) => {
        if (pageState.isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && pageState.hasMore) {
                fetchAllMesages()
            }
        })
        if (node) observer.current.observe(node);
    }, [fetchAllMesages, pageState.isLoading, pageState.hasMore]);

    return (
        <div className="flex-grow py-0 md:py-5 w-[90%] mx-auto mb-8 flex flex-col items-center justify-center">
            <div className={"flex-grow w-full bg-white custom-shadow rounded-3xl py-9 flex flex-col gap-4 justify-center" + (pageState.isLoading || pageState.messages.length === 0 ? "items-center" : "items-start")}>
                {
                    pageState.isLoading && (
                        <div className="w-full flex flex-col items-center justify-center animate-pulse gap-3">
                            <p className="ubuntu-font font-bold text-3xl text-charcoal text-center">Your Messages</p>
                            <div className="h-20 bg-gray-300 rounded-md w-full max-w-md"></div>
                            <div className="h-20 bg-gray-300 rounded-md w-full max-w-md"></div>
                            <div className="h-20 bg-gray-300 rounded-md w-full max-w-md"></div>
                            <div className="h-20 bg-gray-300 rounded-md w-full max-w-md"></div>
                            <div className="h-20 bg-gray-300 rounded-md w-full max-w-md"></div>
                        </div>
                    )
                }
                {
                    pageState.error && (
                        <div className="w-full flex items-center justify-center">
                            <p className="text-red-500">{pageState.error}</p>
                        </div>
                    )
                }
                {
                    pageState.messages.length === 0 && !pageState.isLoading ? (
                        <div className="w-full flex items-center justify-center">
                            <p className="text-charcoal-65">No messages to display</p>
                        </div>
                    )
                        :
                        <div></div>
                }
                {
                    showMessages &&
                    (
                        <div className="w-[90%] lg:w-1/2 mx-auto flex flex-col gap-4">
                            <p className="ubuntu-font font-bold text-3xl text-charcoal text-center">Your Messages</p>
                            {pageState.messages.map((message: AnonMessageData, index: number) => {
                                if (pageState.messages.length === index + 1) {
                                    return (
                                        <div key={message.id} ref={lastMessageRef} className="border border-grey rounded-md p-4 flex flex-col gap-1">
                                            <p className="font-bold">Message:</p>
                                            <p>{message.messageText}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <p className="font-medium">-Anonymous</p>
                                                <p className="text-charcoal-65 text-sm">{message.createdAt.toDate().toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={message.id} className="border border-grey rounded-md p-4 flex flex-col gap-1">
                                            <p className="font-bold">Message:</p>
                                            <p>{message.messageText}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <p className="font-medium">-Anonymous</p>
                                                <p className="text-charcoal-65 text-sm">{message.createdAt.toDate().toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default MessagesPage;