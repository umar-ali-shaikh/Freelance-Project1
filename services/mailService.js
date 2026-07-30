import { getTransporter } from "../config/mail.js";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Strips CRLF so untrusted input can never inject extra mail headers.
function sanitizeHeaderValue(value) {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

export async function sendContactEmail({ name, email, message }) {
  const transporter = getTransporter();

  const safeName = sanitizeHeaderValue(name);
  const safeEmail = sanitizeHeaderValue(email);

  await transporter.sendMail({
    from: `"Website Contact" <${process.env.EMAIL_USER}>`,
    replyTo: safeEmail,
    to: process.env.EMAIL_USER,
    subject: `New Message from ${safeName}`,
    html: `
      <h3>New Contact Message</h3>
      <p><b>Name:</b> ${escapeHtml(name)}</p>
      <p><b>Email:</b> ${escapeHtml(email)}</p>
      <p><b>Message:</b> ${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `,
  });
}
