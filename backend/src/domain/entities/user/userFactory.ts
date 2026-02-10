import {
    User,
    // UserRole,
    // UserStatus
} from "./User";


export class UserFactory {

    static createGoogleUser(params: {
        username: string;
        email: string;
    }): User {
        return new User(
            undefined,                 // id
            params.username,
            params.email,
            null,                      // password (null for Google)
            null,                      // avatar_id
            null,                      // badge_id
            null,                      // level_id
            0,                         // xp
            0,                         // current_streak
            0,                         // longest_streak
            null,                      // last_login_date
            false,                     // is_premium
            new Date(),                // date_joined
            "user",                    // role
            "active",                  // status
            null,                      // refreshToken
            true,                      // isVerified
            null,                      // otp
            null                       // otpExpires
        );
    }




    static createEmailUser(params: {
        username: string;
        email: string;
        hashedPassword: string;
        otp: string;
        otpExpires: Date;
    }): User {
        return new User(
            undefined,
            params.username,
            params.email,
            params.hashedPassword,
            null,
            null,
            null,
            0,
            0,
            0,
            null,
            false,
            new Date(),
            "user",
            "active",
            null,
            false,
            params.otp,
            params.otpExpires
        );
    }


}




