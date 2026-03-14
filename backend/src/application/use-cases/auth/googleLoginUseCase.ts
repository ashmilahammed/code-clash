import { OAuth2Client } from "google-auth-library";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { IJwtService } from "../../../domain/services/IJwtService";
import { JwtPayload } from "../../../domain/types/JwtPayload";
import { UserFactory } from "../../../domain/entities/user/userFactory";
import { GoogleLoginDTO } from "../../dto/auth/GoogleLoginDTO";

export class GoogleLoginUseCase {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _jwtService: IJwtService,
        private readonly _googleClient: OAuth2Client,
        private readonly _googleClientId: string
    ) { }

    async execute(dto: GoogleLoginDTO) {

        const { googleToken: idToken } = dto;

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


