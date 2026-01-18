import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let status = 500;
  let message = "Internal server errors!";
  let error = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    status = 400;
    message = "You provided the incorrect type or value";
  }
  res.status(status);
  res.json({
    message,
    error
  });
}
export default errorHandler;
