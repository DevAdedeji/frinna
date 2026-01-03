import { useState } from "react";
import { Copy, User, Mail, MessagesSquare, MessageCircle, Lock, Check, ExternalLink } from "lucide-react";
import { NavLink } from "react-router-dom";
import ChangeEmailComponent from "@/components/profile/ChangeEmail";
import ChangeUsernameComponent from "@/components/profile/ChangeUsername";
import ChangePasswordComponent from "@/components/profile/ChangePassword";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";

type View = 'default' | 'changeEmail' | 'changeUsername' | 'changePassword';

const ProfileSkeleton = () => (
    <div className="flex-grow py-0 md:py-10 w-full mx-auto mb-8 sm:mb-0 animate-pulse min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="w-full max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-24 w-24 bg-gray-300 rounded-full"></div>
                    <div className="h-10 bg-gray-300 rounded-md w-48"></div>
                    <div className="h-6 bg-gray-300 rounded-md w-64"></div>
                </div>
            </div>
        </div>
    </div>
);

const IndexPage = () => {
    const [currentView, setCurrentView] = useState<View>('default');
    const [copied, setCopied] = useState(false);
    const showDefaultView = () => setCurrentView('default');
    const { user } = useAuthStore();

    const copyToClipboard = () => {
        if (!user?.displayName) return;
        navigator.clipboard.writeText(`https://frinna.vercel.app/message/${user?.displayName ?? ""}`);
        setCopied(true);
        toast.success("Profile link copied");
        setTimeout(() => setCopied(false), 2000);
    }

    const profileUrl = `https://frinna.vercel.app/message/${user?.displayName}`;

    return (
        <div className="flex-grow py-0 md:py-5 w-full mx-auto mb-8 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {
                user && user.displayName ?
                    <div className="w-full max-w-5xl mx-auto px-4 py-8">
                        {/* Profile Header Card */}
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                            {/* Header with gradient background */}
                            <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 h-32 relative">
                                <div className="absolute inset-0 bg-black opacity-10"></div>
                            </div>

                            {/* Profile Content */}
                            <div className="relative px-6 pb-8">
                                {/* Avatar */}
                                <div className="flex justify-center -mt-16 mb-4">
                                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                                        <User className="w-16 h-16 text-white" />
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="text-center mb-6">
                                    <h1 className="ubuntu-font font-bold text-4xl text-gray-800 mb-2">
                                        {user?.displayName}
                                    </h1>
                                    <p className="text-gray-500 font-medium">@{user?.displayName}</p>
                                </div>

                                {/* Profile Link */}
                                <div className="max-w-2xl mx-auto">
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <ExternalLink className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                            <p className="text-gray-700 font-medium truncate text-sm sm:text-base">
                                                {profileUrl}
                                            </p>
                                        </div>
                                        <button
                                            className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                                                copied
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105'
                                            }`}
                                            onClick={copyToClipboard}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        {currentView === 'default' && (
                            <div className="space-y-8">
                                {/* Quick Access Cards */}
                                <div>
                                    <h2 className="ubuntu-font font-bold text-2xl text-gray-800 mb-6 text-center">
                                        Quick Access
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                                        <NavLink
                                            to="/messages"
                                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center gap-4 hover:-translate-y-2 border border-gray-100"
                                        >
                                            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <MessagesSquare className="w-10 h-10 text-white" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-bold text-xl text-gray-800 mb-1">Messages</h3>
                                                <p className="text-gray-500 text-sm">View anonymous messages</p>
                                            </div>
                                        </NavLink>

                                        <NavLink
                                            to="/chats"
                                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center gap-4 hover:-translate-y-2 border border-gray-100"
                                        >
                                            <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                <MessageCircle className="w-10 h-10 text-white" />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-bold text-xl text-gray-800 mb-1">Chats</h3>
                                                <p className="text-gray-500 text-sm">Your conversations</p>
                                            </div>
                                        </NavLink>
                                    </div>
                                </div>

                                {/* Settings Section */}
                                <div className="bg-white rounded-3xl shadow-xl p-8">
                                    <h2 className="ubuntu-font font-bold text-2xl text-gray-800 mb-6 text-center">
                                        Account Settings
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                                        <button
                                            onClick={() => setCurrentView('changeUsername')}
                                            className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3 hover:-translate-y-1"
                                        >
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <User className="w-7 h-7 text-blue-600" />
                                            </div>
                                            <span className="font-semibold text-gray-800">Change Username</span>
                                        </button>

                                        <button
                                            onClick={() => setCurrentView('changeEmail')}
                                            className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-400 hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3 hover:-translate-y-1"
                                        >
                                            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Mail className="w-7 h-7 text-purple-600" />
                                            </div>
                                            <span className="font-semibold text-gray-800">Change Email</span>
                                        </button>

                                        <button
                                            onClick={() => setCurrentView('changePassword')}
                                            className="group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-green-400 hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3 hover:-translate-y-1"
                                        >
                                            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Lock className="w-7 h-7 text-green-600" />
                                            </div>
                                            <span className="font-semibold text-gray-800">Change Password</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Change Views */}
                        {currentView === 'changeEmail' && (
                            <div className="bg-white rounded-3xl shadow-xl p-8">
                                <ChangeEmailComponent onBack={showDefaultView} />
                            </div>
                        )}
                        {currentView === 'changeUsername' && (
                            <div className="bg-white rounded-3xl shadow-xl p-8">
                                <ChangeUsernameComponent onBack={showDefaultView} />
                            </div>
                        )}
                        {currentView === 'changePassword' && (
                            <div className="bg-white rounded-3xl shadow-xl p-8">
                                <ChangePasswordComponent onBack={showDefaultView} />
                            </div>
                        )}
                    </div>
                    :
                    <ProfileSkeleton />
            }
        </div>
    )
}

export default IndexPage;