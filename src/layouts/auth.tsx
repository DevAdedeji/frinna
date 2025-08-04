import { Outlet } from "react-router-dom"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
const AuthLayout = () => {
    return (
        <main className="flex flex-col w-full min-h-screen">
            <Header />
            <div className="flex-grow">
                <Outlet />
            </div>
            <Footer />
        </main>
    )
}

export default AuthLayout;