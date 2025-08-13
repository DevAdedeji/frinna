import { useEffect } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "@/store/useAuthStore";

const AuthListener = () => {
    const { setUser } = useAuthStore();
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        })
        return () => unsubscribe();
    }, [setUser])
    return null;
}

export default AuthListener