import Input from "../ui/Input";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";

interface ChangeEmailComponentProps {
    onBack: () => void;
}

type FormInput = {
    email: string;
}

const ChangeEmailComponent = ({ onBack }: ChangeEmailComponentProps) => {
    const { handleSubmit, register, formState: { errors } } = useForm<FormInput>();
    const onSubmit = () => { }
    return (
        <div className="w-full md:w-1/2 lg:w-[30%] mx-auto flex flex-col items-center justify-center">
            <div className="w-full flex flex-col gap-4">
                <p className="ubuntu-font font-bold text-2xl text-black text-center uppercase">Change Email</p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input className="h-10 md:h-[54px]" type="email" placeholder="Email" {...register("email", { required: "Email is required" })} error={errors.email?.message} />
                    <Button className="h-10 md:h-[54px]">Change Email</Button>
                </form>
            </div>
            <button className="mt-4 text-midnight underline text-sm cursor-pointer text-center" onClick={onBack}>Go back</button>
        </div>
    )
}

export default ChangeEmailComponent