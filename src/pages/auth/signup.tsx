import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useForm, type RegisterOptions } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

type SignUpFormInputs = {
    email: string,
    password: string,
    username: string,
}

const SignUpPage = () => {
    const { handleSubmit, formState: { errors }, register } = useForm<SignUpFormInputs>();

    const [isLoading, setIsLoading] = useState(false);
    const { setUser } = useAuthStore();
    const navigate = useNavigate();

    const passwordValidation: RegisterOptions<SignUpFormInputs, "password"> = {
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

    const onSubmit = async (data: SignUpFormInputs) => {
        setIsLoading(true);
        const toastId = toast.loading("Creating your account");
        try {
            const { email, password, username } = data;

            const formattedUsername = username.toLowerCase().trim();
            const usernameDocRef = doc(db, "usernames", formattedUsername);
            const usernameDoc = await getDoc(usernameDocRef);
            if (usernameDoc.exists()) {
                throw new Error("Username is already taken. Please choose another.");
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const user = userCredential.user;
            //  Update user display name to the username
            await updateProfile(user, {
                displayName: username.trim(),
            })

            // Add username to database
            await setDoc(usernameDocRef, { userId: user.uid });

            const usersProfileDocRef = doc(db, "users", user.uid);
            await setDoc(usersProfileDocRef, {
                username: username.toLowerCase().trim(),
                email,
                createdAt: serverTimestamp(),
                id: user.uid,
                photoURL: user.photoURL,
            })

            toast.success("Account created successfully", { id: toastId });
            setUser(user);
            navigate("/");

        } catch (e: any) {
            const errorMsg = e.message ?? "An unknown error occured";
            toast.error(errorMsg, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full bg-white custom-shadow rounded-3xl py-9 flex flex-col gap-4 items-center justify-center">
            <img src="/images/logo.png" className="size-[150px] object-cover" />
            <p className="text-graphite text-3xl text-center ubuntu-font">Let Us Sign You Up</p>
            <p className="text-stone text-center w-[90%] mx-auto">It’s time to receive mesage from your homies!😉</p>
            <div className="w-[90%] md:w-[80%] flex flex-col gap-5 mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-8">
                    <Input className="h-12" type="email" placeholder="Email Address" {...register("email", { required: "Email is required" })} error={errors.email?.message} />
                    <Input className="h-12" type="text" placeholder="Username" {...register("username", { required: "Username is required" })} error={errors.username?.message} />
                    <Input className="h-12" type="password" placeholder="Password" {...register("password", passwordValidation)} error={errors.password?.message} />
                    <Button className="h-[54px] text-[15px]" variant="secondary" type="submit" disabled={isLoading} >Sign Up</Button>
                </form>
                <p className="uppercase text-grey text-center py-2">OR</p>
                <Button href="/auth/signin" className="h-[54px] w-full">Sign In</Button>
            </div>
        </div>
    )
}

export default SignUpPage;