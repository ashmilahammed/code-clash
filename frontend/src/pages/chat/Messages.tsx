import { useEffect } from 'react';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatWindow from '../../components/chat/ChatWindow';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore } from '../../store/useChatStore';

const Messages = () => {
    const { accessToken } = useAuthStore();
    const { initializeSocket, disconnectSocket, fetchConversations } = useChatStore();

    useEffect(() => {
        if (accessToken) {
            initializeSocket(accessToken);
            fetchConversations();
        }

        return () => {
            // We might want to keep the socket alive across page navigations in a real app,
            // but for this specific page, we can disconnect if it unmounts, OR keep it alive in an app-level useEffect.
            // Assuming we keep it contained to this page for now:
            disconnectSocket();
        };
    }, [accessToken, initializeSocket, fetchConversations, disconnectSocket]);

    return (
        <div className="h-[calc(100vh-4rem)] bg-[#0B1220] flex rounded-xl border border-slate-800 overflow-hidden mx-6 my-6 shadow-2xl">
            <ChatSidebar />
            <ChatWindow />
        </div>
    );
};

export default Messages;
