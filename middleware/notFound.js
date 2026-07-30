export default function notFound(req, res) {
  res.status(404);

  if (req.accepts("html")) {
    res.type("html").send('<h1>404 - Page Not Found</h1><p><a href="/">Return home</a></p>');
    return;
  }

  res.json({ success: false, message: "Resource not found." });
}
