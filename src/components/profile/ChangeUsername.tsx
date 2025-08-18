import Input from "../ui/Input";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { doc, getDoc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { updateProfile } from "firebase/auth";

interface ChangeUsernameComponentProps {
    onBack: () => void;
}

type FormInput = {
    username: string;
}
const ChangeUsernameComponent = ({ onBack }: ChangeUsernameComponentProps) => {

    const { user } = useAuthStore();
    const { handleSubmit, register, formState: { errors }, reset } = useForm<FormInput>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user && user.displayName) {
            reset({
                username: user.displayName,
            })
        }
    }, [user, reset])

    const onSubmit = async (data: FormInput) => {
        if (!user?.displayName) {
            toast.error("Could not find current user. Please sign in again.");
            return;
        }
        const formattedOldUsername = user.displayName.toLowerCase().trim();
        const formattedNewUsername = data.username.toLowerCase().trim();
        if (formattedNewUsername === formattedOldUsername) {
            toast.error("No changes made.");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Changing your username...");
        const oldUsernameDocRef = doc(db, "usernames", formattedOldUsername);
        const newUsernameDocRef = doc(db, "usernames", formattedNewUsername);
        const usersProfileDocRef = doc(db, "users", user.uid);
        try {
            const newUsernameDoc = await getDoc(newUsernameDocRef);
            if (newUsernameDoc.exists()) {
                toast.error("The username is already taken", { id: toastId });
                return;
            }
            // add username to usernames db
            await setDoc(newUsernameDocRef, { userId: user.uid });
            // update user profile display name to new username
            await updateProfile(user, {
                displayName: formattedNewUsername,
            });
            // update user profile username to new username
            await updateDoc(usersProfileDocRef, {
                username: formattedNewUsername,
            });
            // delete old username from usernames db
            await deleteDoc(oldUsernameDocRef);
            toast.success("Username changed successfully", { id: toastId });
            onBack();
        } catch (e: any) {
            toast.error(e.message || "An unknown error occurred.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="w-full md:w-1/2 lg:w-[30%] mx-auto flex flex-col items-center justify-center">
            <div className="w-full flex flex-col gap-4">
                <p className="ubuntu-font font-bold text-2xl text-black text-center uppercase">Change Username</p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input className="h-10 md:h-[54px]" type="text" placeholder="Username" {...register("username", { required: "Username is required" })} error={errors.username?.message} />
                    <Button className="h-10 md:h-[54px]" disabled={isLoading}>Change Username</Button>
                </form>
            </div>
            <button className="mt-4 text-midnight underline text-sm cursor-pointer text-center" onClick={onBack}>Go back</button>
        </div>
    )
}

export default ChangeUsernameComponent