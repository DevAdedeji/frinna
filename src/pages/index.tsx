import { useState } from "react";
import { Copy, User, Mail, MessagesSquare } from "lucide-react";
import Button from "@/components/ui/Button";
import { NavLink } from "react-router-dom";
import ChangeEmailComponent from "@/components/profile/ChangeEmail";
import ChangeUsernameComponent from "@/components/profile/ChangeUsername";
import ChangePasswordComponent from "@/components/profile/ChangePassword";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

type View = 'default' | 'changeEmail' | 'changeUsername' | 'changePassword';

const ProfileSkeleton = () => (
    <div className="flex-grow py-0 md:py-10 w-[90%] mx-auto mb-8 sm:mb-0 animate-pulse">
        <div className="w-full md:w-[80%] min-h-[70vh] flex flex-col gap-10 mx-auto border border-gray-200 bg-gray-50 custom-shadow rounded-3xl px-5 py-5 sm:py-10">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 bg-gray-300 rounded-md w-48"></div>
                <div className="h-7 bg-gray-300 rounded-md w-32"></div>
                <div className="flex items-center justify-center gap-1 sm:gap-4 w-[90%] mx-auto">
                    <div className="h-6 bg-gray-300 rounded-md w-full max-w-md"></div>
                </div>
            </div>
        </div>
    </div>
);

const IndexPage = () => {
    const [currentView, setCurrentView] = useState<View>('default');
    const showDefaultView = () => setCurrentView('default');
    const { user } = useAuthStore();
    const copyToClipboard = () => {
        if (!user?.displayName) return;
        try {
            navigator.clipboard.writeText(`https://frinna.vercel.app/message/${user?.displayName ?? ""}`);
            toast.success("Profile link copied");
        } catch (e) {
            throw e;
        }
    }
    return (
        <div className="flex-grow py-0 md:py-10 w-[90%] mx-auto mb-8 sm:mb-0">
            {
                user && user.displayName ?
                    <div className="w-full md:w-[80%] min-h-[70vh] flex flex-col gap-10 mx-auto border border-white bg-white custom-shadow rounded-3xl px-5 py-5 sm:py-10">
                        <div className="flex flex-col items-center gap-4">
                            <p className="ubuntu-font font-bold text-[40px] text-charcoal text-center">My Profile</p>
                            <p className="font-bold ubuntu-font text-xl text-charcoal">@ {user?.displayName}</p>
                            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-4 text-midnight w-[90%] mx-auto">
                                <p className="font-medium truncate">{`https://frinna.vercel.app/message/${user?.displayName}`}</p>
                                <button className="cursor-pointer" onClick={copyToClipboard}>
                                    <Copy />
                                </button>
                            </div>
                        </div>
                        {
                            currentView === 'default' &&
                            <div className="flex flex-col gap-10">
                                <div className="flex items-center justify-center">
                                    <NavLink className={"btn-shadow size-[200px] bg-white flex flex-col gap-4 items-center justify-center rounded-[5px]"} to="/messages">
                                        <div className="rounded-[50%] bg-sky-blue flex items-center justify-center p-2 size-[50px] text-white">
                                            <MessagesSquare />
                                        </div>
                                        <p>Messages</p>
                                    </NavLink>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <p className="ubuntu-font font-bold text-2xl text-black text-center uppercase">Settings</p>
                                    <div className="w-[80%] mx-auto flex flex-col lg:flex-row items-center justify-center gap-4">
                                        <Button variant="outline" className="btn-shadow gap-4 h-12 w-[260px] !justify-normal" onClick={() => setCurrentView('changeUsername')}>
                                            <User />
                                            <p className="text-black">Change Username</p>
                                        </Button>
                                        <Button variant="outline" className="btn-shadow gap-4 h-12 w-[260px] !justify-normal" onClick={() => setCurrentView('changeEmail')}>
                                            <Mail />
                                            <p className="text-black">Change Email</p>
                                        </Button>
                                        <Button variant="outline" className="btn-shadow gap-4 h-12 w-[260px] !justify-normal" onClick={() => setCurrentView('changePassword')}>
                                            <User />
                                            <p className="text-black">Change Password</p>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            currentView === 'changeEmail' && <ChangeEmailComponent onBack={showDefaultView} />
                        }
                        {
                            currentView === 'changeUsername' && <ChangeUsernameComponent onBack={showDefaultView} />
                        }
                        {
                            currentView === 'changePassword' && <ChangePasswordComponent onBack={showDefaultView} />
                        }
                    </div>
                    :
                    <ProfileSkeleton />
            }
        </div>
    )
}

export default IndexPage;