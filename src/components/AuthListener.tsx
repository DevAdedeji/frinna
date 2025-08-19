import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "@/store/useAuthStore";

const AuthListener = () => {
    const { setUser, setAuthReady } = useAuthStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            if (!isReady) {
                setIsReady(true);
                setAuthReady();
            }
        });

        return () => unsubscribe();
    }, [setUser, setAuthReady, isReady, setIsReady]);

    return null;
}

export default AuthListener;