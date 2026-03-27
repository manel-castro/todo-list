import express from "express";
import { TodosRouter } from "./todos/index.js";

const router = express.Router();

router.use("/todos", TodosRouter);

export { router as ApiRouter };
