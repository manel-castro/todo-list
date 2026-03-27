import express from "express";
import { body } from "express-validator";
import Todo from "../../../models/Todo.js";
import { validateRequest } from "../../../middlewares/validate-request.js";

const router = express.Router();

router.post(
  "/add",
  [
    body("title").isString().withMessage("required-title"),
    body("description").isString().withMessage("required-description"),
    body("responsible").isString().withMessage("required-responsible"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const { title, description, responsible } = req.body;
      const todo = new Todo({ title, description, responsible });
      await todo.save();

      return res.status(201).json(todo);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "add-todo-failed" });
    }
  },
);

export { router as TodosRouter };
