import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type SignInFormInputs = {
    email: string,
    password: string,
    username: string,
}

const SignInPage = () => {
    const { handleSubmit, formState: { errors }, register } = useForm<SignInFormInputs>();

    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const onSubmit = async (data: SignInFormInputs) => {
        setIsLoading(true);
        const toastId = toast.loading("Creating your account");
        try {
            const { email, password, username } = data;
            // DevAdedeji Human Input: Search if username has been taken by another user first
            const formattedUsername = username.toLowerCase();
            const usernameDocRef = doc(db, "usernames", formattedUsername);
            const usernameDoc = await getDoc(usernameDocRef);
            if (usernameDoc.exists()) {
                throw new Error("Username is already taken. Please choose another.");
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const user = userCredential.user;
            //  Update user display name to the username
            await updateProfile(user, {
                displayName: username,
            })

            // Add username to database
            await setDoc(usernameDocRef, { userId: user.uid });

            toast.success("Account created successfully", { id: toastId });

            navigate("/");

        } catch (e: any) {
            console.log(e)
            const errorMsg = e.message ?? e;
            toast.error(errorMsg, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }
    return (

        <div className="w-full sm:w-[500px] bg-white custom-shadow rounded-3xl py-9 flex flex-col gap-4 items-center justify-center">
            <img src="/images/logo.png" className="size-[150px] object-cover" />
            <p className="text-graphite text-3xl text-center ubuntu-font">Let Us Sign You Up</p>
            <p className="text-stone text-center w-[90%] mx-auto">It’s time to receive mesage from your homies!😉</p>
            <div className="w-[80%] flex flex-col gap-5 mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-8">
                    <Input className="h-12" type="email" placeholder="Email Address" {...register("email", { required: "Email is required" })} error={errors.email?.message} />
                    <Input className="h-12" type="text" placeholder="Username" {...register("username", { required: "Username is required" })} error={errors.username?.message} />
                    <Input className="h-12" type="password" placeholder="Password" {...register("password", { required: "Password is required" })} error={errors.password?.message} />
                    <Button className="h-[54px] text-[15px]" variant="secondary" type="submit" disabled={isLoading} >Sign Up</Button>
                </form>
                <p className="uppercase text-grey text-center py-2">OR</p>
                <Button href="/auth/signin" className="h-[54px] w-full">Sign In</Button>
            </div>
        </div>

    )
}

export default SignInPage;