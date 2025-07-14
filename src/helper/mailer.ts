import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.example.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASS = process.env.SMTP_PASS!;

// Fail early if creds are missing
if (!SMTP_USER || !SMTP_PASS) {
  console.warn("⚠️ SMTP credentials are not defined in environment variables.");
}

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});
