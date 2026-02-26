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

            `https://api.dicebear.com/7.x/avataaars/svg?seed=${params.username}`, // avatar
            null,
            null,                      // about
            null,                      // github_url
            null,                      // linkedin_url

            null,                      // badge_id
            null,                      // level_id
            0,                         // xp
            0,                         // current_streak
            0,                         // longest_streak
            null,                      // last_login_date
            false,                     // is_premium
            null,                      // premium_expiry_date
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

            `https://api.dicebear.com/7.x/avataaars/svg?seed=${params.username}`, // avatar
            null,
            null,                      // about
            null,                      // github_url
            null,                      // linkedin_url

            null,                      // badge_id
            null,                      // level_id
            0,                         // xp
            0,                         // current_streak
            0,                         // longest_streak
            null,                      // last_login_date
            false,                     // is_premium
            null,                      // premium_expiry_date
            new Date(),                // date_joined
            "user",                    // role
            "active",                  // status
            null,                      // refreshToken
            false,                     // isVerified
            params.otp,
            params.otpExpires
        );
    }


}




