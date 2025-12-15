import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./infrastructure/database/mongo";
import authRoutes from "./presentation/routes/auth.routes";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

// DB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port", PORT);
  });
}).catch((err) => {
  console.error("Failed to connect to MongoDB", err);
  process.exit(1); 
});
