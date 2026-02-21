const express = require("express");
const redis = require("redis");

const app = express();
const PORT = 3000;

// ===== App metadata =====
const APP_NAME = "hello-devops-backend";
const VERSION = "v2.0.0"; // 🔥 CHANGE THIS TO SEE DEPLOYMENT
const ENV = process.env.NODE_ENV || "development";

// ===== Redis setup =====
const redisClient = redis.createClient({
  socket: {
    host: "redis",
    port: 6379
  }
});

redisClient.connect()
  .then(() => console.log("Connected to Redis"))
  .catch(err => console.error("Redis error:", err));

// ===== Middleware =====
app.use(express.json());

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url}`
  );
  next();
});

// ===== Routes =====

// Home
app.get("/", async (req, res) => {
  const count = await redisClient.incr("hits");

  res.json({
    app: APP_NAME,
    version: VERSION,
    environment: ENV,
    message: "Application running via GitHub Runner + Docker Desktop 🚀",
    totalHits: count,
    time: new Date().toISOString()
  });
});

// Health check (VERY IMPORTANT IN REAL APPS)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    version: VERSION,
    time: new Date().toISOString()
  });
});

// Info endpoint
app.get("/info", (req, res) => {
  res.json({
    name: APP_NAME,
    version: VERSION,
    nodeVersion: process.version,
    uptimeSeconds: process.uptime()
  });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(
    `${APP_NAME} running on port ${PORT} | env=${ENV} | version=${VERSION}`
  );
});