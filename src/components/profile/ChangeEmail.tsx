import Input from "../ui/Input";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useReauthenticate } from "@/hooks/useReauthenticate";
import { updateEmail } from "firebase/auth";

interface ChangeEmailComponentProps {
    onBack: () => void;
}

type FormInput = {
    email: string;
    password: string;
}

const ChangeEmailComponent = ({ onBack }: ChangeEmailComponentProps) => {
    const { handleSubmit, register, formState: { errors }, reset } = useForm<FormInput>();

    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuthStore();

    const { reauthenticate } = useReauthenticate();

    useEffect(() => {
        if (user && user.email) {
            reset({
                email: user.email,
            })
        }
    }, [user, reset])

    const onSubmit = async (data: FormInput) => {
        if (!user?.email) {
            toast.error("Could not find current user. Please sign in again.");
            return;
        }
        const oldEmail = user.email;
        const newEmail = data.email;
        if (oldEmail === newEmail) {
            toast.error("No changes made.");
            return;
        }
        setIsLoading(true);
        const toastId = toast.loading("Changing your email...");
        try {
            await reauthenticate(data.password);
            await updateEmail(user, newEmail);
            toast.success("Email changed successfully", { id: toastId });
        } catch (e: any) {
            toast.error(e.message || "An unknown error occurred.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="w-full md:w-1/2 lg:w-[30%] mx-auto flex flex-col items-center justify-center">
            <div className="w-full flex flex-col gap-4">
                <p className="ubuntu-font font-bold text-2xl text-black text-center uppercase">Change Email</p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input className="h-10 md:h-[54px]" type="email" placeholder="Email" {...register("email", { required: "Email is required" })} error={errors.email?.message} />
                    <Input className="h-12" type="password" placeholder="Password" {...register("password", { required: "Password is required" })} error={errors.password?.message} />
                    <Button className="h-10 md:h-[54px]" disabled={isLoading} >Change Email</Button>
                </form>
            </div>
            <button className="mt-4 text-midnight underline text-sm cursor-pointer text-center" onClick={onBack}>Go back</button>
        </div>
    )
}

export default ChangeEmailComponent