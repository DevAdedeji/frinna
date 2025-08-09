const SignInPage = () => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-8 w-[500px]">
                <img src="/images/mockup.png" className="h-[600px] w-full object-contain" alt="mockup" />
                <p className="text-base text-center">Frinna.xyz is a free-to-use anonymous messaging website where you can register, login, share your link, get messages and continue chatting with your anonymous friend.</p>
            </div>
            <div className="w-[500px] bg-white custom-shadow rounded-3xl py-9 flex flex-col gap-4 items-center justify-center">
                <img src="/images/logo.png" className="size-[150px] object-cover" />
                <p className="text-graphite text-3xl text-center ubuntu-font">Let us sign you in.</p>
                <p className="text-stone">Recieve, reply and chat anonymously! 😉</p>
            </div>
        </div>
    )
}

export default SignInPage;