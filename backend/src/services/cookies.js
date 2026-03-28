// req.headers.cookie;
export const getCookieByName = (cookiesString, name) => {
  const value = `; ${cookiesString}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

export const deleteCookie = (res, cookieName) => {
  res.setHeader("Set-Cookie", [
    `${cookieName}=deleted; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`,
  ]);
};

export const setAccessToken = (res, userAccessJwt) => {
  const ACCESS_TOKEN_EXPIRATION_SECONDS = Number(
    process.env.ACCESS_TOKEN_EXPIRATION_SECONDS,
  );

  const expireTime = new Date(
    Date.now() + ACCESS_TOKEN_EXPIRATION_SECONDS * 1000,
  );

  res.cookie("session", userAccessJwt, {
    expires: expireTime,
    httpOnly: true,
    secure: true,
  });
};
