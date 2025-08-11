import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";

type SignInFormInputs = {
    email: string,
    password: string,
    username: string,
}

const SignInPage = () => {
    const { handleSubmit, formState: { errors }, register } = useForm<SignInFormInputs>();

    const onSubmit = (data: SignInFormInputs) => {
        console.log(data)
    }
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-8 w-[500px]">
                <img src="/images/mockup.png" className="h-[600px] w-full object-contain" alt="mockup" />
                <p className="text-base text-center">Frinna.xyz is a free-to-use anonymous messaging website where you can register, login, share your link, get messages and continue chatting with your anonymous friend.</p>
            </div>
            <div className="w-[500px] bg-white custom-shadow rounded-3xl py-9 flex flex-col gap-4 items-center justify-center">
                <img src="/images/logo.png" className="size-[150px] object-cover" />
                <p className="text-graphite text-3xl text-center ubuntu-font">Let Us Sign You Up</p>
                <p className="text-stone">It’s time to receive mesage from your homies!😉</p>
                <div className="w-[80%] flex flex-col gap-5 mx-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-8">
                        <Input className="h-12" type="email" placeholder="Email Address" {...register("email", { required: "Email is required" })} error={errors.email?.message} />
                        <Input className="h-12" type="text" placeholder="Username" {...register("username", { required: "Username is required" })} error={errors.username?.message} />
                        <Input className="h-12" type="password" placeholder="Password" {...register("password", { required: "Password is required" })} error={errors.password?.message} />
                        <Button className="h-[54px] text-[15px]" variant="secondary" type="submit">Sign Up</Button>
                    </form>
                    <p className="uppercase text-grey text-center py-2">OR</p>
                    <Button href="/auth/signin" className="h-[54px] w-full">Sign In</Button>
                </div>
            </div>
        </div>
    )
}

export default SignInPage;