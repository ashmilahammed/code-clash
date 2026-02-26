import React, { useRef, useEffect, useState } from 'react';
import { useChatStore } from '../../store/useChatStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Send, Hash, Settings, LogOut, Paperclip, Smile, UserPlus, Trash2, Image as ImageIcon } from 'lucide-react';
import InviteModal from './InviteModal';
import { chatApi } from '../../api/chatApi';

const ChatWindow = () => {
    const { activeConversation, messages, sendMessage, deleteMessage, leaveGroup } = useChatStore();
    const { user } = useAuthStore();
    const [inputText, setInputText] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        sendMessage(inputText);
        setInputText('');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeConversation) return;

        try {
            setIsUploading(true);
            const res = await chatApi.uploadChatImage(activeConversation.id, file);
            sendMessage("Image", "image", res.url);
        } catch (error) {
            console.error("Failed to upload image", error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDeleteMessage = (messageId: string) => {
        setMessageToDelete(messageId);
    };

    const confirmDeleteMessage = () => {
        if (messageToDelete) {
            deleteMessage(messageToDelete);
            setMessageToDelete(null);
        }
    };

    const handleLeaveGroup = () => {
        if (!activeConversation) return;
        setShowLeaveModal(true);
    };

    const confirmLeaveGroup = async () => {
        if (!activeConversation) return;
        await leaveGroup(activeConversation.id);
        setShowLeaveModal(false);
    };

    if (!activeConversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0B1220] text-slate-500 h-full">
                <Hash size={48} className="mb-4 opacity-20" />
                <p>Select a group or user to start chatting</p>
            </div>
        );
    }

    const isGroup = activeConversation.type === 'group';

    return (
        <div className="flex-1 flex flex-col h-full bg-[#0B1220] relative">
            {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[#141C2F]">
                <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {isGroup && <Hash size={18} className="text-blue-500" />}
                        {activeConversation.name || 'Direct Message'}
                    </h2>
                    {isGroup && (
                        <p className="text-xs text-slate-400">{activeConversation.participants.length} members</p>
                    )}
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                    {isGroup && activeConversation.isPrivate && (
                        <button
                            onClick={() => setShowInviteModal(true)}
                            title="Invite Members"
                            className="hover:text-white p-2 hover:bg-slate-800 rounded-full transition"
                        >
                            <UserPlus size={18} />
                        </button>
                    )}
                    <button className="hover:text-white p-2 hover:bg-slate-800 rounded-full transition"><Settings size={18} /></button>
                    {isGroup && (
                        <button
                            onClick={handleLeaveGroup}
                            title="Leave Group"
                            className="hover:text-red-400 p-2 hover:bg-slate-800 rounded-full transition"
                        >
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {messages.map((message) => {
                    const isMine = message.senderId === user?.id;

                    return (
                        <div key={message.id} className={`group flex flex-col max-w-[75%] ${isMine ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-slate-300">
                                    {isMine ? 'You' : (message.sender?.username || `User ${message.senderId.slice(0, 4)}`)}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {isMine && !message.isDeleted && (
                                    <button
                                        onClick={() => handleDeleteMessage(message.id)}
                                        className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                            <div
                                className={`px-4 py-2 rounded-2xl text-sm ${isMine
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-[#1A2338] text-slate-200 rounded-tl-none border border-slate-800'
                                    } ${message.isDeleted ? 'italic text-opacity-70 bg-transparent border border-slate-700 !text-slate-500' : ''}`}
                            >
                                {message.isDeleted ? (
                                    <span className="flex items-center gap-2"><Trash2 size={14} className="opacity-50" /> {message.content}</span>
                                ) : message.messageType === 'image' && message.mediaUrl ? (
                                    <div className="flex flex-col gap-2">
                                        <a href={message.mediaUrl} target="_blank" rel="noopener noreferrer">
                                            <img src={message.mediaUrl} alt="Chat attachment" className="max-w-[250px] max-h-[250px] rounded-lg object-cover bg-slate-800" />
                                        </a>
                                    </div>
                                ) : (
                                    message.content
                                )}
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-[#141C2F] border-t border-slate-800">
                <form onSubmit={handleSend} className="flex items-center gap-2 bg-[#0B1220] rounded-full border border-slate-700 px-4 py-2">
                    <button type="button" className="text-slate-400 hover:text-white transition"><Smile size={20} /></button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className={`text-slate-400 hover:text-white transition ${isUploading ? 'opacity-50 animate-pulse' : ''}`}
                    >
                        {isUploading ? <ImageIcon size={20} /> : <Paperclip size={20} />}
                    </button>

                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={`Message ${activeConversation.name || 'user'}`}
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none px-2"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-2 rounded-full transition flex items-center justify-center h-8 w-8"
                    >
                        <Send size={14} className={inputText.trim() ? "translate-x-px" : ""} />
                    </button>
                </form>
                <p className="text-center text-[10px] text-slate-500 mt-2">Messages are encrypted end-to-end</p>
            </div>

            {/* Leave Group Modal */}
            {showLeaveModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#141C2F] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Leave Group?</h3>
                            <p className="text-slate-400 text-sm mb-6 pb-2">
                                Are you sure you want to leave <span className="text-white font-semibold">"{activeConversation.name}"</span>? You will not receive any further messages from this group.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLeaveModal(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLeaveGroup}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-900/20"
                                >
                                    Leave Group
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Message Modal */}
            {messageToDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#141C2F] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Message?</h3>
                            <p className="text-slate-400 text-sm mb-6 pb-2">
                                Are you sure you want to delete this message? This action will remove the message for everyone in the chat.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setMessageToDelete(null)}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteMessage}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-lg shadow-red-900/20"
                                >
                                    Delete For Everyone
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
