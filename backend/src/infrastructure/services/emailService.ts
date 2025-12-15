import { ENV } from "../../config/env";
import nodemailer from "nodemailer";



export class EmailService {
  private transporter;

  constructor() {
    
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
      },
    });
  }

  async sendOtpEmail(to: string, otp: string) {
    const mailOptions = {
      from: ENV.EMAIL_USER,
      to,
      subject: "Your OTP Verification Code",
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP code is:</p>
        <h1 style="font-size: 32px;">${otp}</h1>
        <p>This code will expire in 1 minute.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
