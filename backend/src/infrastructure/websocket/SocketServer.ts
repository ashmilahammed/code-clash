import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { JwtService } from "../services/security/jwtService";
import { UserRepository } from "../repositories/user/UserRepository";
import { WinstonLogger } from "../services/logger";
import { sendMessageUseCase, getConversationsUseCase, deleteMessageUseCase } from "../di/chat.di";

export class SocketServer {
    private io: SocketIOServer;
    private jwtService: JwtService;
    private userRepository: UserRepository;
    private logger: WinstonLogger;

    constructor(server: HttpServer) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: "http://localhost:5173",
                credentials: true,
            },
        });

        this.jwtService = new JwtService();
        this.userRepository = new UserRepository();
        this.logger = new WinstonLogger();

        this.setupMiddleware();
        this.setupEventHandlers();
    }

    private setupMiddleware() {
        this.io.use(async (socket: Socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

                if (!token) {
                    return next(new Error("Authentication error: No token provided"));
                }

                const decoded = this.jwtService.verifyAccessToken(token) as { userId: string };
                const user = await this.userRepository.findById(decoded.userId);

                if (!user || user.status === "blocked") {
                    return next(new Error("Authentication error: Invalid or blocked user"));
                }

                socket.data.userId = user.id;
                next();
            } catch (error) {
                this.logger.error("Socket authentication error", error);
                next(new Error("Authentication error: Invalid token"));
            }
        });
    }

    private setupEventHandlers() {
        this.io.on("connection", async (socket: Socket) => {
            const userId = socket.data.userId;
            this.logger.info(`User connected via Socket.io: ${userId}`);

            // Auto-join all rooms the user is part of
            try {
                const conversations = await getConversationsUseCase.execute(userId);
                conversations.forEach(conv => {
                    if (conv.id) {
                        socket.join(conv.id);
                    }
                });

                // Also join their own personal room for direct messages initiated by others
                socket.join(userId);

            } catch (error) {
                this.logger.error("Error auto-joining rooms on connection", error);
            }

            socket.on("join_conversation", (conversationId: string) => {
                socket.join(conversationId);
            });

            socket.on("send_message", async (data: { conversationId: string; content: string; messageType?: 'text' | 'image'; mediaUrl?: string }) => {
                try {
                    const message = await sendMessageUseCase.execute({
                        conversationId: data.conversationId,
                        senderId: userId,
                        content: data.content,
                        ...(data.messageType ? { messageType: data.messageType } : {}),
                        ...(data.mediaUrl ? { mediaUrl: data.mediaUrl } : {})
                    });

                    // Emit to all users in the conversation
                    this.io.to(data.conversationId).emit("receive_message", message);

                    // We can also emit an event to notify about updated conversation list
                    this.io.to(data.conversationId).emit("conversation_list_updated", {
                        conversationId: data.conversationId,
                        lastMessage: message
                    });

                } catch (error) {
                    this.logger.error("Error sending message via socket", error);
                    socket.emit("error", { message: "Failed to send message" });
                }
            });

            socket.on("delete_message", async (data: { messageId: string; conversationId: string }) => {
                try {
                    const deletedMessage = await deleteMessageUseCase.execute(data.messageId, userId);

                    // Emit deletion to all users in the conversation
                    this.io.to(data.conversationId).emit("message_deleted", deletedMessage);
                } catch (error) {
                    this.logger.error("Error deleting message via socket", error);
                    socket.emit("error", { message: "Failed to delete message" });
                }
            });

            socket.on("disconnect", () => {
                this.logger.info(`User disconnected: ${userId}`);
            });
        });
    }
}
