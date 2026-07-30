import rateLimit from "express-rate-limit";

// Contact form is the only write endpoint exposed publicly — limit it
// specifically so it can't be used to spam the inbox or exhaust the SMTP quota.
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again in a few minutes.",
  },
});
