import express from "express";
import { TodosRouter } from "./todos/index.js";
import { AuthRouter } from "./auth/index.js";

const router = express.Router();

router.use("/todos", TodosRouter);
router.use("/auth", AuthRouter);

export { router as ApiRouter };
