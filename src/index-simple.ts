import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Simple server is working!", status: "ok" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Simple server running on port ${port}`);
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM, shutting down...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("Received SIGINT, shutting down...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
