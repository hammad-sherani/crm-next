import type { SendMailOptions } from "nodemailer";
import { transporter } from "./mailer";

/**
 * Sends a password reset link to the user's email
 * @param to - Recipient email address
 * @param link - Password reset link
 */
export const resetMail = async (to: string, link: string): Promise<boolean> => {
  const fromEmail = process.env.SMTP_USER;

  if (!fromEmail) {
    console.error("❌ SMTP_USER is not defined in environment variables.");
    throw new Error("SMTP configuration error");
  }

  const mailOptions: SendMailOptions = {
    from: `"Your App" <${fromEmail}>`,
    to,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${link}" style="color: #0070f3;">Reset Password</a>
        <p>This link is valid for the next <strong>10 minutes</strong>.</p>
        <p>If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Reset email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending reset email:", error);
    throw new Error("Failed to send reset email");
  }
};
