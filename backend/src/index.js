import mongoose from "mongoose";

import app from "./app.js";

/**
 * CHECK ALL ENVIRONMENT VARIABLES ARE SET
 */
const requiredEnv = [
  "MONGO_URI",
  "PORT",
  "JWT_SECRET",
  "ACCESS_TOKEN_EXPIRATION_SECONDS",
];

const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}`,
  );
}

/**
 * CONNECT MONGODB AND START SERVER
 */
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
