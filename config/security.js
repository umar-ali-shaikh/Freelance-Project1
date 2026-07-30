// Content-Security-Policy allowlist, derived from every external host the
// frontend in /public actually references (Tailwind CDN, Google Fonts,
// Font Awesome, Lucide, GSAP, Swiper, blog images, testimonial images, the
// YouTube embed). If a new CDN/script/image host is added to the frontend,
// it must be added here too or the browser will silently block it.

const scriptSrc = [
  "'self'",
  "'unsafe-inline'", // inline tailwind config + onclick="" handlers in index.html
  "https://cdn.tailwindcss.com",
  "https://unpkg.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
];

const styleSrc = [
  "'self'",
  "'unsafe-inline'", // Tailwind CDN injects <style> at runtime; inline style attrs in markup
  "https://fonts.googleapis.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
];

const fontSrc = [
  "'self'",
  "data:",
  "https://fonts.gstatic.com",
  "https://cdnjs.cloudflare.com",
];

const imgSrc = [
  "'self'",
  "data:",
  "https://rudvedev.com",
  "https://assets.technologynetworks.com",
  "https://assets.everspringpartners.com",
  "https://lh3.googleusercontent.com",
];

export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc,
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc,
      fontSrc,
      imgSrc,
      connectSrc: ["'self'"],
      mediaSrc: ["'self'"],
      frameSrc: ["https://www.youtube.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  },
};

/**
 * CORS is locked down by default (origin: false) because the frontend and
 * the /api routes are served by this same Express app — same-origin fetch
 * calls are never subject to CORS in the first place. Set CORS_ORIGIN in
 * .env (comma-separated) only if another domain needs to call the API.
 */
export function getCorsOptions() {
  const configuredOrigin = process.env.CORS_ORIGIN;

  return {
    origin: configuredOrigin
      ? configuredOrigin.split(",").map((origin) => origin.trim())
      : false,
    methods: ["GET", "POST"],
  };
}
