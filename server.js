import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import contactRoutes from "./routes/contact.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import { helmetOptions, getCorsOptions } from "./config/security.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

app.disable("x-powered-by");

app.use(helmet(helmetOptions));
app.use(compression());
app.use(cors(getCorsOptions()));
app.use(express.json({ limit: "10kb" }));

app.use(
  express.static(PUBLIC_DIR, {
    etag: true,
    maxAge: "1d",
    setHeaders: (res, filePath) => {
      // HTML must always revalidate so deploys show up immediately;
      // hashed/static assets (images, fonts, js, css) can cache longer.
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

app.use("/api/send-mail", contactRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
