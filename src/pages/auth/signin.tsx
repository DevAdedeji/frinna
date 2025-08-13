import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type SignInFormInputs = {
    email: string,
    password: string,
}

const SignInPage = () => {
    const { handleSubmit, formState: { errors }, register } = useForm<SignInFormInputs>();

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();


    const onSubmit = async (data: SignInFormInputs) => {
        setIsLoading(true);
        const toastId = toast.loading("Signing you in....")
        try {
            const { email, password } = data;
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Welcome back", { id: toastId });
            navigate("/");
        } catch (e: any) {
            let errorMsg = e.message.replace("FirebaseError: ", "");
            errorMsg = errorMsg.replace("Firebase: ", "")
            toast.error(errorMsg, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="w-full sm:w-[500px] bg-white custom-shadow rounded-3xl py-9 flex flex-col gap-4 items-center justify-center">
            <img src="/images/logo.png" className="size-[150px] object-cover" />
            <p className="text-graphite text-3xl text-center ubuntu-font">Let us sign you in.</p>
            <p className="text-stone text-center w-[90%] mx-auto">Recieve, reply and chat anonymously! 😉</p>
            <div className="w-[80%] flex flex-col gap-5 mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-8">
                    <Input className="h-12" type="email" placeholder="Email Address" {...register("email", { required: "Email is required" })} error={errors.email?.message} />
                    <Input className="h-12" type="password" placeholder="Password" {...register("password", { required: "Password is required" })} error={errors.password?.message} />
                    <Button className="h-[54px] text-[15px]" variant="secondary" type="submit" disabled={isLoading} >Sign In</Button>
                </form>
                <p className="uppercase text-grey text-center py-2">OR</p>
                <Button href="/auth/signup" className="h-[54px] w-full">Sign Up</Button>
            </div>
        </div>
    )
}

export default SignInPage;