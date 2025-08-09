import { Outlet } from "react-router-dom"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const AuthLayout = () => {
    return (
        <main className="flex flex-col w-full min-h-screen bg-background">
            <Header />
            <div className="flex-grow py-10 w-[90%] mx-auto">
                <Outlet />
            </div>
            <Footer />
        </main>
    )
}

export default AuthLayout;