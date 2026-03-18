import { ConversationRepository } from "../repositories/chat/ConversationRepository";
import { MessageRepository } from "../repositories/chat/MessageRepository";

import { CreateGroupUseCase } from "../../application/use-cases/chat/user/CreateGroupUseCase";
import { JoinGroupUseCase } from "../../application/use-cases/chat/user/JoinGroupUseCase";
import { GetConversationsUseCase } from "../../application/use-cases/chat/user/GetConversationsUseCase";
import { SendMessageUseCase } from "../../application/use-cases/chat/user/SendMessageUseCase";
import { GetMessagesUseCase } from "../../application/use-cases/chat/user/GetMessagesUseCase";
import { GetOrCreateDirectConversationUseCase } from "../../application/use-cases/chat/user/GetOrCreateDirectConversationUseCase";
import { GetPublicConversationsUseCase } from "../../application/use-cases/chat/user/GetPublicConversationsUseCase";
import { LeaveGroupUseCase } from "../../application/use-cases/chat/user/LeaveGroupUseCase";
import { AddParticipantsUseCase } from "../../application/use-cases/chat/user/AddParticipantsUseCase";
import { UploadChatImageUseCase } from "../../application/use-cases/chat/user/UploadChatImageUseCase";
import { DeleteMessageUseCase } from "../../application/use-cases/chat/user/DeleteMessageUseCase";
import { userRepository } from "./user.di";

// Admin Use Cases
import { GetAdminGroupsUseCase } from "../../application/use-cases/chat/admin/GetAdminGroupsUseCase";
import { UpdateGroupStatusUseCase } from "../../application/use-cases/chat/admin/UpdateGroupStatusUseCase";
import { DeleteGroupUseCase } from "../../application/use-cases/chat/admin/DeleteGroupUseCase";

import { CloudinaryStorageService } from "../adapters/fileStorage/CloudinaryStorageService";
import { badgeRewardService } from "./badge.di";

// Repositories
export const conversationRepository = new ConversationRepository();
export const messageRepository = new MessageRepository();

// Use Cases
export const createGroupUseCase = new CreateGroupUseCase(conversationRepository, userRepository);
export const joinGroupUseCase = new JoinGroupUseCase(conversationRepository, userRepository, badgeRewardService);
export const getConversationsUseCase = new GetConversationsUseCase(conversationRepository);
export const sendMessageUseCase = new SendMessageUseCase(messageRepository, conversationRepository, userRepository);
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
