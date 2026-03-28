import express from "express";
import { body, query } from "express-validator";
import Todo from "../../../models/Todo.js";
import { validateRequest } from "../../../middlewares/validate-request.js";
import { currentUser } from "../../../middlewares/current-user.js";
import { requireAuth } from "../../../middlewares/require-auth.js";
import { BadRequestError } from "../../../errors/bad-request-error.js";

const router = express.Router();

router.post(
  "/add",
  [
    currentUser,
    requireAuth,
    body("title").isString().withMessage("required-title"),
    body("description").isString().withMessage("required-description"),
    body("responsible").isString().withMessage("required-responsible"),
    body("completed").optional().isBoolean(),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const userId = req.currentUser.id;

      const { title, description, responsible, completed } = req.body;
      const todo = new Todo({
        title,
        description,
        responsible,
        completed,
        userId,
      });
      await todo.save();

      return res.status(201).json(todo);
    } catch (err) {
      console.error(err);
      return next(new BadRequestError("add-todo-failed"));
    }
  },
);

router.get("/list", [currentUser, requireAuth], async (req, res, next) => {
  try {
    const userId = req.currentUser.id;

    const todos = await Todo.find({ userId });

    return res.status(200).json(todos);
  } catch (err) {
    console.error(err);
    return next(new BadRequestError("list-todos-failed"));
  }
});

router.put(
  "/update",
  [
    currentUser,
    requireAuth,
    body("id").isString().withMessage("required-id"),
    body("title").optional().isString(),
    body("description").optional().isString(),
    body("responsible").optional().isString(),
    body("completed").optional().isBoolean(),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const userId = req.currentUser.id;

      const { id, title, description, responsible, completed } = req.body;

      const update = {};
      if (title !== undefined) update.title = title;
      if (description !== undefined) update.description = description;
      if (responsible !== undefined) update.responsible = responsible;
      if (completed !== undefined) update.completed = completed;

      const updated = await Todo.findOneAndUpdate(
        { _id: id, userId }, // include userId for security
        { $set: update },
        { new: true, runValidators: true },
      );

      if (!updated) {
        return next(new BadRequestError("todo-not-found"));
      }

      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return next(new BadRequestError("update-todo-failed"));
    }
  },
);

export { router as TodosRouter };
