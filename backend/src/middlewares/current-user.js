import { NotAuthorizedError } from "../errors/not-authorized-error";
import { deleteCookie, getCookieByName } from "../services/cookies";
import { VerifyJwtToken } from "../services/tokens";

export const currentUser = (req, res, next) => {
  const accessToken = getCookieByName(req.headers.cookie, "session");

  if (!accessToken) {
    return next(new NotAuthorizedError());
  }

  try {
    const payload = VerifyJwtToken(accessToken, process.env.JWT_SECRET);

    req.currentUser = payload;
  } catch (e) {
    deleteCookie(res, "session");
    return next(new NotAuthorizedError());
  }

  next();
};
