import { ConversationRepository } from "../repositories/chat/ConversationRepository";
import { MessageRepository } from "../repositories/chat/MessageRepository";

import { CreateGroupUseCase } from "../../application/use-cases/chat/CreateGroupUseCase";
import { JoinGroupUseCase } from "../../application/use-cases/chat/JoinGroupUseCase";
import { GetConversationsUseCase } from "../../application/use-cases/chat/GetConversationsUseCase";
import { SendMessageUseCase } from "../../application/use-cases/chat/SendMessageUseCase";
import { GetMessagesUseCase } from "../../application/use-cases/chat/GetMessagesUseCase";
import { GetOrCreateDirectConversationUseCase } from "../../application/use-cases/chat/GetOrCreateDirectConversationUseCase";
import { GetPublicConversationsUseCase } from "../../application/use-cases/chat/GetPublicConversationsUseCase";
import { LeaveGroupUseCase } from "../../application/use-cases/chat/LeaveGroupUseCase";
import { AddParticipantsUseCase } from "../../application/use-cases/chat/AddParticipantsUseCase";
import { UploadChatImageUseCase } from "../../application/use-cases/chat/UploadChatImageUseCase";
import { DeleteMessageUseCase } from "../../application/use-cases/chat/DeleteMessageUseCase";

// Admin Use Cases
import { GetAdminGroupsUseCase } from "../../application/use-cases/chat/GetAdminGroupsUseCase";
import { UpdateGroupStatusUseCase } from "../../application/use-cases/chat/UpdateGroupStatusUseCase";
import { DeleteGroupUseCase } from "../../application/use-cases/chat/DeleteGroupUseCase";

import { CloudinaryStorageService } from "../adapters/fileStorage/CloudinaryStorageService";

// Repositories
export const conversationRepository = new ConversationRepository();
export const messageRepository = new MessageRepository();

// Use Cases
export const createGroupUseCase = new CreateGroupUseCase(conversationRepository);
export const joinGroupUseCase = new JoinGroupUseCase(conversationRepository);
export const getConversationsUseCase = new GetConversationsUseCase(conversationRepository);
export const sendMessageUseCase = new SendMessageUseCase(messageRepository, conversationRepository);
export const getMessagesUseCase = new GetMessagesUseCase(messageRepository, conversationRepository);
export const getOrCreateDirectConversationUseCase = new GetOrCreateDirectConversationUseCase(conversationRepository);
export const getPublicConversationsUseCase = new GetPublicConversationsUseCase(conversationRepository);

const cloudinaryService = new CloudinaryStorageService();
export const uploadChatImageUseCase = new UploadChatImageUseCase(cloudinaryService);
export const leaveGroupUseCase = new LeaveGroupUseCase(conversationRepository);
export const addParticipantsUseCase = new AddParticipantsUseCase(conversationRepository);
export const deleteMessageUseCase = new DeleteMessageUseCase(messageRepository);

export const getAdminGroupsUseCase = new GetAdminGroupsUseCase(conversationRepository);
export const updateGroupStatusUseCase = new UpdateGroupStatusUseCase(conversationRepository);
export const deleteGroupUseCase = new DeleteGroupUseCase(conversationRepository);

import { ChatController } from "../../presentation/controllers/chat.controller";
export const chatController = new ChatController(
    createGroupUseCase,
    joinGroupUseCase,
    getConversationsUseCase,
    getMessagesUseCase,
    getOrCreateDirectConversationUseCase,
    getPublicConversationsUseCase,
    leaveGroupUseCase,
    addParticipantsUseCase,
    uploadChatImageUseCase
);

import { AdminChatController } from "../../presentation/controllers/adminChat.controller";
export const adminChatController = new AdminChatController(
    getAdminGroupsUseCase,
    updateGroupStatusUseCase,
    deleteGroupUseCase
);
