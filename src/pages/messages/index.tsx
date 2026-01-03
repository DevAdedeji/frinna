import { db } from "@/firebase";
import { collection, getDocs, query, limit, where, type Timestamp, QueryDocumentSnapshot, type DocumentData, startAfter, orderBy } from "firebase/firestore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import { Mail, Inbox, Clock } from "lucide-react";

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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            const errorMessage = e.message ?? "An unknown error occurred.";
            toast.error(errorMessage);
            setPageState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
        }
    }, [user, pageState.hasMore, pageState.lastVisible, pageState.isLoading])

    const showMessages = useMemo(() => {
        return pageState.messages.length > 0 && !pageState.isLoading;
    }, [pageState.messages, pageState.isLoading]);

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
        <div className="flex-grow py-0 md:py-5 w-full mx-auto mb-8 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            <div className="w-full max-w-4xl px-4">
                {/* Header */}
                <div className="mb-8 text-center pt-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="ubuntu-font font-bold text-4xl text-gray-800 mb-2">Your Messages</h1>
                    <p className="text-gray-500">Anonymous messages sent to you</p>
                </div>

                {/* Messages Container */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Loading State */}
                    {pageState.isLoading && pageState.messages.length === 0 && (
                        <div className="p-8 flex flex-col gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 h-32 rounded-xl"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {pageState.error && (
                        <div className="p-8 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                                <Mail className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-red-600 font-medium">{pageState.error}</p>
                        </div>
                    )}

                    {/* Empty State */}
                    {pageState.messages.length === 0 && !pageState.isLoading && (
                        <div className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                                <Inbox className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No messages yet</h3>
                            <p className="text-gray-500">Your anonymous messages will appear here</p>
                        </div>
                    )}

                    {/* Messages List */}
                    {showMessages && (
                        <div className="p-6 md:p-8">
                            <div className="space-y-4">
                                {pageState.messages.map((message: AnonMessageData, index: number) => {
                                    const isLast = pageState.messages.length === index + 1;
                                    return (
                                        <div
                                            key={message.id}
                                            ref={isLast ? lastMessageRef : null}
                                            className="group relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
                                        >
                                            {/* Decorative element */}
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-cyan-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            <div className="flex items-start gap-4">
                                                {/* Avatar */}
                                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center shadow-md">
                                                    <Mail className="w-6 h-6 text-white" />
                                                </div>

                                                {/* Message Content */}
                                                <div className="flex-grow min-w-0">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-sm">
                                                            Anonymous
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{message.createdAt.toDate().toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}</span>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                                                            {message.messageText}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Loading More Indicator */}
                            {pageState.isLoading && pageState.messages.length > 0 && (
                                <div className="mt-6 text-center">
                                    <div className="inline-flex items-center gap-2 text-blue-600">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            )}

                            {/* End of Messages */}
                            {!pageState.hasMore && pageState.messages.length > 0 && (
                                <div className="mt-8 text-center">
                                    <p className="text-gray-400 text-sm">You've reached the end of your messages</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MessagesPage;