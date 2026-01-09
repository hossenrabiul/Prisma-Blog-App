import { JWTPayload } from "better-auth/*";
import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
export enum userRole {
  "USER" = "USER",
  "ADMIN" = "ADMIN"
}

export const auth = (...roles: String[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await betterAuth.api.getSession({
      headers: req.headers as any,
    });
    // console.log(session);
    if (!session) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized",
      });
    }
    if (!session.user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email verify is required, Please verify your email",
      });
    }

    req.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      emailVerified: session.user.emailVerified,
    };

    if (roles.length && !roles.includes(req?.user?.role as String)) {
      console.log(session.user.role);
      return res.status(400).json({
        success: false,
        message: "You have no access to create post",
      });
    }
    next();
  };
};
