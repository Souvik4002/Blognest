import { verifyUser } from "../utils/auth.js";

export async function restrictToLoggedInUserOnly(req, res, next) {
  const token = req.cookies.uid;
  if (!token) {
    req.authError = "you need to login first";
    return next();
  }

  const userPlayLoad = verifyUser(token);
  if (!userPlayLoad) {
    req.authError = "user not found, Incorrect email or password";
    return next();
  }

  req.user = userPlayLoad;

  return next();
}

