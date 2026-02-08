import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./infrastructure/database/mongo";
import authRoutes from "./presentation/routes/auth.routes";
import adminRoutes from "./presentation/routes/admin.routes"
import userRoutes from "./presentation/routes/user.routes";
import challengeRoutes from "./presentation/routes/challenge.routes";

import { WinstonLogger } from "./infrastructure/services/logger";

dotenv.config();

const app = express();
const logger = new WinstonLogger();


app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/challenges", challengeRoutes);



const PORT = process.env.PORT || 5000;


// DB + server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running on port", PORT);
      logger.info("Server started", { port: PORT });

    });
  }).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    logger.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
