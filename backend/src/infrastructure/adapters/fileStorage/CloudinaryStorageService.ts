import { v2 as cloudinary } from "cloudinary";
import { IFileStorageService } from "../../../domain/services/IFileStorageService";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export class CloudinaryStorageService implements IFileStorageService {

  async uploadAvatar(file: Buffer, userId: string) {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars",
          public_id: `avatar_${userId}`,
          overwrite: true,
          transformation: [{ width: 256, height: 256, crop: "fill" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(file);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async uploadChatImage(file: Buffer, conversationId: string) {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `chat/${conversationId}`,
          transformation: [{ width: 1080, crop: "limit" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(file);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async deleteFile(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
  }
}
