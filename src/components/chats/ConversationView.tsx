import { ChevronLeft } from "lucide-react";
import Button from "../ui/Button";
interface ConversationViewProps {
    conversationId: string | null;
    onBack: () => void;
}
const ConversationView = ({ conversationId, onBack }: ConversationViewProps) => {
    if (!conversationId) {
        return (
            <div className="bg-white cnview-shadow w-full h-full flex items-center justify-center">
                <p className="text-center uppercase text-charcoal w-1/2 mx-auto ubuntu-font font-bold text-4xl">
                    CLICK ON A MESSAGE TO VIEW
                </p>
            </div>
        );
    }
    return (
        <div className="w-full bg-white cnview-shadow max-h-[90vh] overflow-hidden flex py-4 sm:py-10 px-4 sm:px-9 flex-col">
            <div className="flex items-center gap-2">
                <Button variant="secondary" className="!p-0 !size-[35px]" onClick={onBack}>
                    <ChevronLeft className="!text-base" />
                </Button>
                <div className="flex-grow">
                    <p className="font-bold">Chat with Anon name</p>
                </div>
            </div>
        </div>
    )
}

export default ConversationView;