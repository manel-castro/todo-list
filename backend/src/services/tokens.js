import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRATION_SECONDS = Number(
  process.env.ACCESS_TOKEN_EXPIRATION_SECONDS || "3600",
);

const REFRESH_TOKEN_EXPIRATION_SECONDS = Number(
  process.env.REFRESH_TOKEN_EXPIRATION_SECONDS || String(60 * 60 * 24 * 30),
);

export const createRefreshToken = ({ username }) => {
  const exp = Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRATION_SECONDS;

  return jwt.sign(
    {
      username,
      exp,
    },
    process.env.JWT_SECRET_REFRESH,
  );
};

export const createAccessToken = ({ id, username }) => {
  const exp = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRATION_SECONDS;

  const jwtToken = jwt.sign(
    {
      id,
      username,
      exp,
    },
    process.env.JWT_SECRET,
  );

  return jwtToken;
};

export const VerifyJwtToken = (jwt_token, jwt_key) => {
  const payload = jwt.verify(jwt_token, jwt_key);

  if (typeof payload !== "object") {
    throw new Error("invalid payload - type of string");
  }

  if (!payload.exp) {
    throw new Error("invalid payload - no exp");
  }

  if (payload.exp < Date.now() / 1000) {
    throw new Error("token expired");
  }

  return payload;
};
