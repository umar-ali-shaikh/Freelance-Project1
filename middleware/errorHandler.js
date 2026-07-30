export default function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;

  // Hide internal error details on 5xx; 4xx messages are already
  // safe/intentional (thrown by our own validation and route code).
  const message = status < 500 ? err.message : "Something went wrong. Please try again later.";

  res.status(status).json({ success: false, message });
}
