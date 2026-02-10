import { OAuth2Client } from "google-auth-library";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IJwtService } from "../../../domain/services/IJwtService";
import { JwtPayload } from "../../../domain/types/JwtPayload";
import { UserFactory } from "../../../domain/entities/user/userFactory";


export class GoogleLoginUseCase {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _jwtService: IJwtService,
        private readonly _googleClient: OAuth2Client,
        private readonly _googleClientId: string
    ) { }

    async execute(idToken: string) {
        // Verify Google token
        const ticket = await this._googleClient.verifyIdToken({
            idToken,
            audience: this._googleClientId,
        });

        const payload = ticket.getPayload();

        if (!payload || typeof payload.email !== "string") {
            throw new Error("INVALID_GOOGLE_TOKEN");
        }

        const email: string = payload.email;


        // name always string
        const username: string =
            typeof payload.name === "string" && payload.name.trim().length > 0
                ? payload.name.trim()
                : email.split("@")[0] ?? email;


        // find or create user
        let user = await this._userRepo.findByEmail(email);

        // if (!user) {
        //     user = await this._userRepo.createUser({
        //         username,
        //         email,
        //         password: null,
        //         avatar_id: null,
        //         badge_id: null,
        //         level_id: null,
        //         xp: 0,
        //         current_streak: 0,
        //         longest_streak: 0,
        //         is_premium: false,
        //         date_joined: new Date(),
        //         role: "user",
        //         status: "active",
        //         refreshToken: null,
        //         isVerified: true,
        //         otp: null,
        //         otpExpires: null,
        //     });
        // }
        if (!user) {
            const newUser = UserFactory.createGoogleUser({
                username,
                email,
            });

            user = await this._userRepo.createUser(newUser);
        }

        
        //generate token
        const tokenPayload: JwtPayload = {
            userId: user.id!,
            role: user.role,
        };

        const accessToken = this._jwtService.generateAccessToken(tokenPayload);
        const refreshToken = this._jwtService.generateRefreshToken(tokenPayload);

        // Store refresh token
        await this._userRepo.updateRefreshToken(user.id!, refreshToken);

        return { user, accessToken, refreshToken };
    }
}


