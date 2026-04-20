import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./infrastructure/database/mongo";
import authRoutes from "./presentation/routes/auth.routes";
import adminRoutes from "./presentation/routes/admin.routes"
import userRoutes from "./presentation/routes/user.routes";
import challengeRoutes from "./presentation/routes/challenge.routes";
import submissionRoutes from "./presentation/routes/submission.routes";
import levelRoutes from "./presentation/routes/level.routes";
import badgeRoutes from "./presentation/routes/badge.routes";
import chatRoutes from "./presentation/routes/chat.routes";
import transactionRoutes from "./presentation/routes/transaction.routes";
import reportRoutes from "./presentation/routes/report.routes";

import { WinstonLogger } from "./infrastructure/services/logger";
import { startPremiumExpirationJob } from "./infrastructure/services/scheduler/PremiumSchedulerService";

import { createServer } from "http";
import { SocketServer } from "./infrastructure/websocket/SocketServer";

import { API_ROUTES } from "./presentation/constants/routes";

dotenv.config();

const app = express();
const logger = new WinstonLogger();


app.use(cors({
  // origin: true,
  origin: [
    "http://localhost:5173",
    "https://code-clash.ddns.net"
  ],
  credentials: true
}));
// app.use(express.json());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cookieParser());

// Routes
app.use(API_ROUTES.AUTH, authRoutes);
app.use(API_ROUTES.ADMIN, adminRoutes);

app.use(API_ROUTES.USER, userRoutes);
app.use(API_ROUTES.CHALLENGES, challengeRoutes);
app.use(API_ROUTES.SUBMISSIONS, submissionRoutes);
app.use(API_ROUTES.LEVELS, levelRoutes);
app.use(API_ROUTES.BADGES, badgeRoutes);
app.use(API_ROUTES.CHAT, chatRoutes);
app.use(API_ROUTES.TRANSACTIONS, transactionRoutes);
app.use(API_ROUTES.REPORTS, reportRoutes);


app.get("/test", (req, res) => {
  res.send("Backend is running");
});


const PORT = process.env.PORT || 5000;

// DB + server
connectDB()
  .then(() => {
    const httpServer = createServer(app);

    // Initialize Socket Server
    new SocketServer(httpServer);

    // Start Premium Expiration Job
    startPremiumExpirationJob();

    httpServer.listen(PORT, () => {
      console.log("Server running on port", PORT);
      logger.info("Server started", { port: PORT });
    });
  }).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    logger.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
