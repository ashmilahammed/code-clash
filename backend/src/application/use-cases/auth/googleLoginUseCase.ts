import { OAuth2Client } from "google-auth-library";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { JwtService } from "../../../infrastructure/security/jwtService";



export class GoogleLoginUseCase {
    constructor(
        private userRepo: IUserRepository,
        private googleClient: OAuth2Client,
        private googleClientId: string
    ) { }

    async execute(idToken: string) {

        // Verify Google token
        const ticket = await this.googleClient.verifyIdToken({
            idToken,
            audience: this.googleClientId,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new Error("Invalid Google token");
        }

        const email = payload.email;

        // name always string
        const name: string = (payload.name ?? email.split("@")[0]) as string;

        // Check if user exists
        let user = await this.userRepo.findByEmail(email);

        if (!user) {
            user = await this.userRepo.createUser({
                username: name,
                email,
                password: null,
                avatar_id: null,
                badge_id: null,
                level_id: null,
                xp: 0,
                current_streak: 0,
                longest_streak: 0,
                is_premium: false,
                date_joined: new Date(),
                role: "user",
                status: "active",
                refreshToken: null,

                // skip OTP verification
                isVerified: true,
                otp: null,
                otpExpires: null,
            });
        }

        // Generate tokens
        const tokenPayload = {
            userId: user.id!,
            email: user.email,
            role: user.role,
        };

        const accessToken = JwtService.generateAccessToken(tokenPayload);
        const refreshToken = JwtService.generateRefreshToken(tokenPayload);

        // Store refresh token
        await this.userRepo.updateRefreshToken(user.id!, refreshToken);

        return { user, accessToken, refreshToken };


    }
}




// import { OAuth2Client } from "google-auth-library";
// import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
// import { JwtService } from "../../../infrastructure/security/jwtService";



// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// if (!GOOGLE_CLIENT_ID) {
//     throw new Error("GOOGLE_CLIENT_ID is not defined");
// }

// const client = new OAuth2Client(GOOGLE_CLIENT_ID);
// const userRepo = new UserRepository();

// export const googleLoginUseCase = async (idToken: string) => {
//     // Verify Google token
//     const ticket = await client.verifyIdToken({
//         idToken,
//         audience: GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     if (!payload || !payload.email) {
//         throw new Error("Invalid Google token");
//     }

//     const email = payload.email;

//     // name always string
//     const name: string = (payload.name ?? email.split("@")[0]) as string;

//     //
//     let user = await userRepo.findByEmail(email);

//     if (!user) {
//         user = await userRepo.createUser({
//             username: name,
//             email,
//             password: null,
//             avatar_id: null,
//             badge_id: null,
//             level_id: null,
//             xp: 0,
//             current_streak: 0,
//             longest_streak: 0,
//             is_premium: false,
//             date_joined: new Date(),
//             role: "user",
//             status: "active",
//             refreshToken: null,

//             //skip OTP verification
//             isVerified: true,
//             otp: null,
//             otpExpires: null,
//         });
//     }

//     // generate tokens
//     const tokenPayload = {
//         userId: user.id!,
//         email: user.email,
//         role: user.role,
//     };

//     const accessToken = JwtService.generateAccessToken(tokenPayload);
//     const refreshToken = JwtService.generateRefreshToken(tokenPayload);

//     //Store refresh token
//     await userRepo.updateRefreshToken(user.id!, refreshToken);

//     return { user, accessToken, refreshToken };
// };



