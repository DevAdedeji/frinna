import { ChevronLeft } from "lucide-react"
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useAuthStore } from "@/store/useAuthStore";
interface ConversationListProps {
    onConversationSelect: (id: string) => void;
    selectedConversationId: string | null;
}

const ConversationList = ({ onConversationSelect, selectedConversationId }: ConversationListProps) => {
    const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const { user } = useAuthStore();
    return (
        <div className="w-full flex flex-col gap-4 bg-background max-h-[90vh] py-4 sm:py-10 px-4 sm:px-9 overflow-y-hidden">
            <div className="flex items-center gap-2">
                <Button variant="secondary" className="!p-0 !size-[35px]">
                    <ChevronLeft className="!text-base" />
                </Button>
                <p className="ubuntu-font font-bold text-3xl text-charcoal ">Messages</p>
            </div>
            <Input placeholder="Search conversation" ringColor="ring-charcoal" className="mt-4" />
            <div className="w-full flex flex-col overflow-y-auto no-scrollbar">
                {
                    list.map((item, index) => (
                        <button type="button" key={index} className={"w-full  flex justify-between py-5" + (index === list.length - 1 ? " border-none" : " border-b border-grey") + (selectedConversationId === item.toString() ? "bg-sky-200" : "bg-transparent")} onClick={() => onConversationSelect(item.toString())}>
                            <div className="flex items-center gap-2">
                                <div className="size-[50px] rounded-full flex items-center justify-center">
                                    {
                                        user?.photoURL ?
                                            <img src={user.photoURL} alt="User Avatar" className="rounded-full w-full h-full object-cover" />
                                            :
                                            <div className="w-full h-full bg-gray-300 rounded-full text-center"></div>
                                    }
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-base font-semibold">Anon name</p>
                                    <p className="text-sm text-charcoal-65">Last message</p>
                                </div>
                            </div>
                            <p className="text-charcoal-65 text-xs">Monday 16:45</p>
                        </button>
                    ))
                }
            </div>
        </div>
    );
}

export default ConversationList;