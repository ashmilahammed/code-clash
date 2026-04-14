import { useEffect } from 'react';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatWindow from '../../components/chat/ChatWindow';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';

const Messages = () => {
    const { accessToken } = useAuthStore();
    const { activeConversation, initializeSocket, disconnectSocket, fetchConversations } = useChatStore();

    useEffect(() => {
        if (accessToken) {
            initializeSocket(accessToken);
            fetchConversations();
        }

        return () => {
            disconnectSocket();
        };
    }, [accessToken, initializeSocket, fetchConversations, disconnectSocket]);

    return (
        <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-7rem)] bg-[#0B1220] flex md:rounded-xl md:border md:border-slate-800 overflow-hidden md:mx-6 md:my-6 shadow-2xl">
            <div className={`${activeConversation ? 'hidden md:flex' : 'flex'} w-full md:w-64 h-full`}>
                <ChatSidebar />
            </div>
            <div className={`${!activeConversation ? 'hidden md:flex' : 'flex'} flex-1 h-full`}>
                <ChatWindow />
            </div>
        </div>
    );
};

export default Messages;
