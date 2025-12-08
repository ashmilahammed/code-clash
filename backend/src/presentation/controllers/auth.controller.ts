import { Request, Response } from "express";
import User from "../../infrastructure/database/models/UserModel";
import bcrypt from "bcrypt";
import { JwtService } from "../../infrastructure/security/jwtService";



const jwtService = new JwtService();

export const registerController = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        email,
        password: hashed,
    });

    const safeUser = {
        id: user._id,
        username: user.username,
        email: user.email
    };

    return res.json({
        message: "User registered successfully",
        user: safeUser
    });
};



export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: user._id, role: user.role };

    // 🔥 Use your JwtService for both tokens  
    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    const safeUser = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    };

    return res.json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: safeUser
    });
};
