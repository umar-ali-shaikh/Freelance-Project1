# DP Power Solutions

EV charging infrastructure marketing site with a production-ready Express
backend for the contact form.

## Folder structure

```
project/
│
├── public/                  # everything served to the browser
│   ├── index.html
│   ├── css/style.css
│   ├── js/script.js
│   ├── assets/               # images, hero video
│   └── fonts/                # BDOGrotesk (ttf/otf/woff2/variable)
│
├── routes/
│   └── contact.js            # POST /api/send-mail
├── controllers/
│   └── contactController.js  # request validation + response shaping
├── services/
│   └── mailService.js        # Nodemailer sending logic
├── middleware/
│   ├── errorHandler.js
│   ├── notFound.js
│   └── rateLimiter.js
├── config/
│   ├── mail.js                # SMTP transporter
│   └── security.js            # helmet CSP + CORS options
│
├── server.js                 # app entrypoint
├── package.json
├── .env.example
└── .gitignore
```

`Untitled-1.html` (an unused draft blog layout) and `DP-power-solutions.zip`
(a manual backup) are left at the project root as-is — neither is served
or referenced by the app.

## Requirements

- Node.js 18+
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords)
  (regular Gmail passwords won't work with SMTP)

## Setup

```bash
npm install
cp .env.example .env
# then edit .env and fill in EMAIL_USER / EMAIL_PASS
```

## Running

```bash
npm run dev      # nodemon, auto-restarts on file change
npm start         # production
```

The app serves the frontend from `public/` and the API from `/api/*` on
the same port (`PORT` in `.env`, default `3000`). Open http://localhost:3000.

## API

### `POST /api/send-mail`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Interested in a fleet charging quote."
}
```

Validation (server-side, in `controllers/contactController.js`):
- `name`: 2–100 characters
- `email`: valid email format, ≤254 characters
- `message`: 5–2000 characters

Responses:
- `200 { success: true, message }` — email sent
- `400 { success: false, message }` — validation failed
- `429 { success: false, message }` — rate limit hit (5 requests / 15 min / IP)
- `500 { success: false, message }` — send failed (internal details are never
  exposed to the client; check server logs)

## Security

- **Helmet** — standard hardening headers, plus a `Content-Security-Policy`
  allowlisting exactly the external hosts the frontend uses (Tailwind CDN,
  Google Fonts, Font Awesome/cdnjs, jsDelivr, unpkg, the blog/testimonial
  image hosts, and the YouTube embed). If you add a new external script,
  stylesheet, font, or image host to `public/index.html`, add it to
  `config/security.js` too, or the browser will block it.
- **Rate limiting** — `/api/send-mail` is capped at 5 requests per 15
  minutes per IP (`middleware/rateLimiter.js`).
- **Input validation & sanitization** — done server-side regardless of what
  the browser sends. Email body content is HTML-escaped and header values
  (name/email used in `From`/`Subject`/`Reply-To`) are stripped of CR/LF to
  prevent header injection.
- **CORS** — disabled by default (`origin: false`). The frontend and API
  are same-origin, so this doesn't affect the site; only set `CORS_ORIGIN`
  in `.env` if a different domain needs to call the API directly.
- **Error handling** — a global error handler hides internal error details
  on 5xx responses; only intentional 4xx messages reach the client.

Known accepted risk: `nodemailer`'s advisory about the `raw` message option
does not apply here — this codebase never uses the `raw` option, only
structured fields (`from`/`to`/`replyTo`/`subject`/`html`).

## Deployment

Works anywhere that can run `npm install && npm start` and exposes a port:

- **Render / Railway** — connect the repo, set `EMAIL_USER`/`EMAIL_PASS`
  (and `PORT` if the platform requires a fixed value) as environment
  variables, build command `npm install`, start command `npm start`.
- **Hostinger Node.js hosting** — set the entry file to `server.js`, add
  the env vars in the hosting panel, then `npm install && npm start`.
- **DigitalOcean App Platform** — same as Render/Railway: env vars +
  `npm start`.
- **Ubuntu VPS** — clone the repo, `npm install`, create `.env` from
  `.env.example`, then run under a process manager, e.g.:
  ```bash
  npm install -g pm2
  pm2 start server.js --name dp-power-solutions
  ```
  Put Nginx in front for TLS/reverse proxy if the app isn't directly
  internet-facing.

No build step is required — `public/` is served as-is.
