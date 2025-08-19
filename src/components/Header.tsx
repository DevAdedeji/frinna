import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import Button from "./ui/Button";
import { signOut, getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Header = () => {
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const auth = getAuth();
    const logUserOut = async () => {
        try {
            setIsLoading(true);
            await signOut(auth)
        } catch (e: any) {
            toast.error(e.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <header className="flex items-center justify-center min-h-[60px]">
            <nav className="w-[90%] mx-auto flex items-center justify-between py-4">
                <Link to="/" className="flex items-center gap-4">
                    <img src="/images/logo.png" className="size-[60px] object-cover" />
                    <p className="text-charcoal uppercase font-bold">FRINNA</p>
                </Link>
                {
                    user &&
                    <Button onClick={logUserOut} disabled={isLoading}>Log out</Button>
                }
            </nav>
        </header>
    )
}

export default Header;