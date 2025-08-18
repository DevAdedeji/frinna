import Input from "../ui/Input";
import { useForm, type RegisterOptions } from "react-hook-form";
import Button from "../ui/Button";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useReauthenticate } from "@/hooks/useReauthenticate";
import { updatePassword } from "firebase/auth";

interface ChangePasswordComponentProps {
    onBack: () => void;
}

type FormInput = {
    oldPassword: string;
    password: string;
}

const ChangePasswordComponent = ({ onBack }: ChangePasswordComponentProps) => {
    const { handleSubmit, register, formState: { errors } } = useForm<FormInput>();

    const passwordValidation: RegisterOptions<FormInput, "password"> = {
        required: "Password is required",
        minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
        },
        validate: {
            hasUpperCase: (value) => /[A-Z]/.test(value) || "Password must include an uppercase letter",
            hasLowerCase: (value) => /[a-z]/.test(value) || "Password must include a lowercase letter",
            hasNumber: (value) => /\d/.test(value) || "Password must include a number"
        }
    }

    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuthStore();

    const { reauthenticate } = useReauthenticate();


    const onSubmit = async (data: FormInput) => {
        if (!user) {
            toast.error("Could not find current user. Please sign in again.");
            return;
        }
        const oldPassword = data.oldPassword;
        const newPassowrd = data.password;
        if (oldPassword === newPassowrd) {
            toast.error("Old password and new password is the same");
            return;
        }
        setIsLoading(true);
        const toastId = toast.loading("Changing your password...");
        try {
            await reauthenticate(data.oldPassword);
            await updatePassword(user, data.password);
            toast.success("Password changed successfully", { id: toastId });
        } catch (e: any) {
            toast.error(e.message || "An unknown error occurred.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="w-full md:w-1/2 lg:w-[30%] mx-auto flex flex-col items-center justify-center">
            <div className="w-full flex flex-col gap-4">
                <p className="ubuntu-font font-bold text-2xl text-black text-center uppercase">Change Password</p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input className="h-12" type="password" placeholder="Old password" {...register("oldPassword", { required: "Old password is required" })} error={errors.oldPassword?.message} />
                    <Input className="h-12" type="password" placeholder="New password" {...register("password", passwordValidation)} error={errors.password?.message} />
                    <Button className="h-10 md:h-[54px]" disabled={isLoading} >Change Password</Button>
                </form>
            </div>
            <button className="mt-4 text-midnight underline text-sm cursor-pointer text-center" onClick={onBack}>Go back</button>
        </div>
    )
}

export default ChangePasswordComponent