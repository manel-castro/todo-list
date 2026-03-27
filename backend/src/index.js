import express from "express";
import mongoose from "mongoose";
import { body } from "express-validator";
import Todo from "./models/Todo.js";
import { validateRequest } from "./middlewares/validate-request.js";
import { ApiRouter } from "./routes/api/index.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

/**
 * CONNECT MONGODB
 */
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

/**
 * ROUTES
 */
app.use("/api", ApiRouter);

/**
 * ERROR HANDLER
 */
app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
