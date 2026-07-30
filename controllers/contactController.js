import { sendContactEmail } from "../services/mailService.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContactPayload({ name, email, message }) {
  const errors = [];

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
    errors.push("Name must be between 2 and 100 characters.");
  }

  if (
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !EMAIL_REGEX.test(email.trim())
  ) {
    errors.push("A valid email address is required.");
  }

  if (typeof message !== "string" || message.trim().length < 5 || message.trim().length > 2000) {
    errors.push("Message must be between 5 and 2000 characters.");
  }

  return errors;
}

export async function submitContactForm(req, res, next) {
  try {
    const { name, email, message } = req.body || {};

    const errors = validateContactPayload({ name, email, message });

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    return res.status(200).json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    next(error);
  }
}
