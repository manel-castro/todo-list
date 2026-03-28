import { NotAuthorizedError } from "../errors/not-authorized-error";

export const requireAuth = (req, res, next) => {
  if (!req.currentUser) {
    return next(new NotAuthorizedError());
  }
  next();
};
