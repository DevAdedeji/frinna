import Button from "@/components/ui/Button";

const MessageUserPage = () => {
    return (
        <div className="w-full sm:w-[500px] bg-white custom-shadow rounded-3xl py-9 flex flex-col gap-4 items-center justify-center">
            <img src="/images/logo.png" className="size-[150px] object-cover" />
            <p className="text-graphite text-3xl text-center ubuntu-font">Send A Message To User</p>
            <p className="text-stone text-center w-[90%] mx-auto">Your friend wants you to send them a message!😉</p>
            <form className="w-[80%] mx-auto flex flex-col gap-6 mt-8">
                <Button className="h-[54px] w-full text-[15px]" variant="primary" type="submit">Send Message</Button>
            </form>
        </div>
    )
}


export default MessageUserPage;