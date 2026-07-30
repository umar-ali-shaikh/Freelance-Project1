import nodemailer from "nodemailer";

let transporter;

/**
 * Lazily creates a single reusable Nodemailer transporter.
 * Throws at call time (not import time) so a missing .env doesn't crash
 * the whole server before dotenv has had a chance to load.
 */
export function getTransporter() {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error(
        "EMAIL_USER and EMAIL_PASS environment variables must be set to send mail."
      );
    }

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  return transporter;
}
