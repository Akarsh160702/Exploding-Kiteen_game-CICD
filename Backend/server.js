const express = require("express");
const Redis = require("ioredis");
const cors = require("cors");

const app = express();

// Updated Redis connection using environment variables
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

// Redis connection logs
redis.on("connect", () => {
  console.log("Connected to Redis successfully!");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "https://exploding-kitten-1607.netlify.app", // Updated to match your Netlify URL
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Cache-Control"],
  })
);

// Cache-control headers to prevent caching
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// Endpoint to get points of a user
app.get("/points/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const points = (await redis.get(`user:${userId}:points`)) || 0;
    console.log(`Retrieved points from Redis for user ${userId}:`, points);
    res.json({ username: userId, score: parseInt(points) });
  } catch (error) {
    console.error("Error fetching points from Redis:", error);
    res.status(500).json({ error: "Failed to fetch points" });
  }
});

// Endpoint to increment points of a user after a game win
app.post("/points/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { incrementBy } = req.body; // Number of points to increment

  if (typeof incrementBy !== "number") {
    return res.status(400).json({ error: "Increment value must be a number" });
  }

  try {
    // Increment score by the specified amount
    const newScore = await redis.incrby(`user:${userId}:points`, incrementBy);
    console.log(`Updated points for user ${userId}: ${newScore}`);
    res.json({
      message: "Points updated successfully",
      username: userId,
      score: newScore,
    });
  } catch (error) {
    console.error("Error updating points in Redis:", error);
    res.status(500).json({ error: "Failed to update points" });
  }
});

// Leaderboard endpoint to fetch leaderboard data
app.get("/leaderboard", async (req, res) => {
  try {
    // Retrieve all keys for users' points
    const keys = await redis.keys("user:*:points");
    console.log("Keys retrieved from Redis:", keys);
    const leaderboard = [];

    if (keys.length > 0) {
      const validKeys = keys.filter((key) => key.match(/^user:[^:]+:points$/));
      const scores = await redis.mget(validKeys);

      validKeys.forEach((key, index) => {
        const username = key.split(":")[1];
        const score = parseInt(scores[index] || "0", 10);
        leaderboard.push({ username, score });
      });

      leaderboard.sort((a, b) => b.score - a.score);
    }

    console.log("Final leaderboard data:", leaderboard);
    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard from Redis:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});