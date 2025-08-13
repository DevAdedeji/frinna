import { Outlet } from "react-router-dom"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const AuthLayout = () => {
    return (
        <main className="flex flex-col w-full min-h-screen bg-background">
            <Header />
            <div className="flex-grow py-0 md:py-10 w-[90%] mx-auto mb-8 sm:mb-0">
                <div className="flex flex-col lg:flex-row gap-10 lg:gap-0 items-center justify-between">
                    <div className="lg:order-1 order-2 flex flex-col gap-2 sm:gap-8 w-full sm:w-[500px]">
                        <img src="/images/mockup.png" className="sm:h-[600px] w-full object-contain" alt="mockup" />
                        <p className="text-base text-center">Frinna.xyz is a free-to-use anonymous messaging website where you can register, login, share your link, get messages and continue chatting with your anonymous friend.</p>
                    </div>
                    <div className="w-full sm:w-[500px] lg:order-2 order-1">
                        <Outlet />
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}

export default AuthLayout;