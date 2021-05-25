import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { AuthError } from "src/utils/errors";

export const auth = function (req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    throw new AuthError("Please login first to view this content.");
  }
  // Verify token
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET_KEY || "");
    req.userId = payload.userId;
    next();
  } catch (err) {
    next(err);
  }
}
