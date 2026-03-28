import express from "express";
import { body } from "express-validator";
import User from "../../../models/User.js";
import { validateRequest } from "../../../middlewares/validate-request.js";
import { Password } from "../../../services/password.js";
import jwt from "jsonwebtoken";
import {
  createAccessToken,
  createRefreshToken,
} from "../../../services/tokens.js";
import { setAccessToken, setRefreshToken } from "../../../services/cookies.js";
import { BadRequestError } from "../../../errors/bad-request-error.js";
import { currentUser } from "../../../middlewares/current-user.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("username").isString().withMessage("Username is required"),
    body("password")
      .isLength({ min: 6, max: 20 })
      .withMessage("Password must be between 6 and 20 characters"),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      // check existing user by username
      const existing = await User.findOne({ username });
      if (existing) {
        return next(new BadRequestError("User already exists"));
      }

      // hashing: use pepper (from env) and the central Password service

      const hashed = await Password.toHash(password);

      const user = await User.create({ username, password: hashed });

      const userObj = user.toJSON();

      const accessToken = createAccessToken({
        id: userObj.id,
        username: userObj.username,
      });
      const refreshToken = createRefreshToken({ username: userObj.username });

      // Store it in the user's cookies
      setRefreshToken(res, refreshToken);
      setAccessToken(res, accessToken);

      return res.status(201).send();
    } catch (err) {
      console.error(err);
      return next(new BadRequestError("Failed to create user"));
    }
  },
);

router.post(
  "/login",
  [
    body("username").isString().withMessage("Username is required"),
    body("password")
      .isLength({ min: 6, max: 20 })
      .withMessage("Password must be between 6 and 20 characters"),
    validateRequest,
  ],
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const existing = await User.findOne({ username });
      if (!existing) {
        return next(new BadRequestError("User not found"));
      }

      const passwordsMatch = await Password.compare(
        existing.password,
        password,
      );

      if (!passwordsMatch) {
        return next(new BadRequestError("Invalid username or password"));
      }

      const accessToken = createAccessToken({
        id: existing.id,
        username: existing.username,
      });
      const refreshToken = createRefreshToken({ username: existing.username });

      // Store it in the user's cookies
      setRefreshToken(res, refreshToken);
      setAccessToken(res, accessToken);

      return res.status(200).send();
    } catch (err) {
      console.error(err);
      return next(new BadRequestError("Login failed"));
    }
  },
);

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("session");
    res.clearCookie("refreshToken");

    res.send({});
  } catch (err) {
    console.error(err);
    return next(new BadRequestError("Logout failed"));
  }
});

// endpoint used by frontend to verify if there is a valid session cookie
router.get("/user-authenticated", currentUser, async (req, res) => {
  if (req.currentUser) {
    return res.status(200).send({ authenticated: true, user: req.currentUser });
  } else {
    return res.status(401).send({ authenticated: false });
  }
});

export { router as AuthRouter };
