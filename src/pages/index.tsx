import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Copy, User, Mail, MessagesSquare } from "lucide-react";
import Button from "@/components/ui/Button";
import { NavLink } from "react-router-dom";

const IndexPage = () => {
    return (
        <main className="flex flex-col gap-8 sm:gap-0 w-full min-h-screen bg-background">
            <Header />
            <div className="flex-grow flex pb-4">
                <div className="w-[90%] md:w-[70%] min-h-[70vh] flex flex-col gap-10 mx-auto border border-white bg-white custom-shadow rounded-3xl px-5 py-5 sm:py-10">
                    <div className="flex flex-col items-center gap-4">
                        <p className="ubuntu-font font-bold text-[40px] text-charcoal text-center">My Profile</p>
                        <p className="font-bold ubuntu-font text-xl text-charcoal">@DevAdedeji</p>
                        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-4 text-midnight">
                            <p className="font-medium">https://frinna.xyz/message/Oladimeji</p>
                            <button>
                                <Copy />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <NavLink className={"btn-shadow size-[200px] bg-white flex flex-col gap-4 items-center justify-center rounded-[5px]"} to="">
                            <div className="rounded-[50%] bg-sky-blue flex items-center justify-center p-2 size-[50px] text-white">
                                <MessagesSquare />
                            </div>
                            <p>Messages</p>
                        </NavLink>
                    </div>
                    <div className="flex flex-col gap-4">
                        <p className="ubuntu-font font-bold text-2xl text-black text-center uppercase">Settings</p>
                        <div className="w-[80%] mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button variant="outline" className="btn-shadow gap-4 h-12 w-[260px] !justify-normal">
                                <User />
                                <p className="text-black">Change Username</p>
                            </Button>
                            <Button variant="outline" className="btn-shadow gap-4 h-12 w-[260px] !justify-normal">
                                <Mail />
                                <p className="text-black">Change Email</p>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}

export default IndexPage;