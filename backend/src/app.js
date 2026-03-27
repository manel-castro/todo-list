import express from "express";
import { ApiRouter } from "./routes/api/index.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();
app.use(express.json());

app.use("/api", ApiRouter);

app.use(errorHandler);

export default app;
