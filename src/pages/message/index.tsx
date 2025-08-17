import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useParams } from "react-router-dom";
import { db } from "@/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";

const MessageUserPage = () => {
    const { user } = useAuthStore();

    const { username } = useParams<{ username: string }>();

    const [pageState, setPageState] = useState({
        senderId: null as string | null,
    });


    useEffect(() => {
        const initializePage = async () => {
            setPageState(prev => ({ ...prev }))
            try {
                if (!username || !user) {
                    throw "";
                }
                const senderId = user.uid;
                const usersRef = collection(db, "users");
                const formattedUsername = username.toLowerCase()
                const q = query(usersRef, where("username", "==", formattedUsername), limit(1));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const recipientId = querySnapshot.docs[0].id;
                    console.log(senderId)
                    console.log(recipientId);
                    setPageState({
                        senderId,
                    })
                    console.log(pageState);
                }
            } catch (e) {
                console.log(e);
            }
        }
        initializePage();
    }, [user, username]);

    const handleSendMessage = () => {
        //
    }

    return (
        <div className="bg-white custom-shadow rounded-3xl py-9 flex flex-col gap-4 items-center justify-center">
            <img src="/images/logo.png" className="size-[150px] object-cover" />
            <p className="text-graphite text-3xl text-center ubuntu-font">Send A Message To User</p>
            <p className="text-stone text-center w-[90%] mx-auto">Your friend wants you to send them a message!😉</p>
            <form className="w-[80%] mx-auto flex flex-col gap-6 mt-8" onSubmit={handleSendMessage}>
                <Button className="h-[54px] w-full text-[15px]" variant="primary" type="submit">Send Message</Button>
            </form>
        </div>
    )
}


export default MessageUserPage;