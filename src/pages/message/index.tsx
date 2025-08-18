import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useParams } from "react-router-dom";
import { db } from "@/firebase";
import { collection, getDocs, limit, query, where, serverTimestamp, addDoc, } from "firebase/firestore";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormInput = {
    messageText: string,
}


const MessageUserPage = () => {
    const { user } = useAuthStore();
    const { handleSubmit, formState: { errors }, register, reset } = useForm<FormInput>();

    const { username } = useParams<{ username: string }>();

    const [pageState, setPageState] = useState({
        recipientId: null as string | null,
    });
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const initializePage = async () => {
            setPageState(prev => ({ ...prev }))
            try {
                if (!username) {
                    throw "User not found";
                }
                const usersRef = collection(db, "users");
                const formattedUsername = username.toLowerCase()
                const q = query(usersRef, where("username", "==", formattedUsername), limit(1));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const recipientId = querySnapshot.docs[0].id;
                    setPageState({
                        recipientId,
                    })
                }
            } catch (e: any) {
                toast.error(e.message ?? e)
            }
        }
        initializePage();
    }, [user, username]);

    const handleSendMessage = async (data: FormInput) => {
        if (!pageState.recipientId) {
            toast.error("User not found");
            return;
        }
        const toastId = toast.loading("Sending your message...");
        try {
            setIsLoading(true);
            const input = {
                recipientId: pageState.recipientId,
                messageText: data.messageText,
                isRead: false,
                isArchived: false,
                createdAt: serverTimestamp(),
            }
            const anonMessagesDocRef = collection(db, "anonymous_messages");
            await addDoc(anonMessagesDocRef, input);
            toast.success("Message sent successfully", { id: toastId })
            reset({
                messageText: "",
            })
        } catch (e: any) {
            toast.error(e.message || "An unknown error occurred", { id: toastId })
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="bg-white custom-shadow rounded-3xl py-9 flex flex-col gap-4 items-center justify-center">
            <img src="/images/logo.png" className="size-[150px] object-cover" />
            <p className="text-graphite text-3xl text-center ubuntu-font">Send A Message To User</p>
            <p className="text-stone text-center w-[90%] mx-auto">Your friend wants you to send them a message!😉</p>
            <form className="w-[80%] mx-auto flex flex-col gap-6 mt-8" onSubmit={handleSubmit(handleSendMessage)}>
                <TextArea className="h-[170px]" placeholder="Type in your message" {...register("messageText", { required: "Message is required" })} error={errors.messageText?.message} />
                <Button className="h-[54px] w-full text-[15px]" variant="primary" type="submit" disabled={isLoading}>Send Message</Button>
            </form>
        </div>
    )
}


export default MessageUserPage;