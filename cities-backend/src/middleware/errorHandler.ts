import type { NextFunction, Request, Response } from "express";
import { isForeignKeyConstraintError } from "../errors/isForeignKeyConstraintError.ts";
import { HttpError } from "../errors/HttpError.ts";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (isForeignKeyConstraintError(error)) {
    return res.status(400).json({
      error: "Ogiltig input",
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.status).json({
      error: error.message,
    });
  }

  console.error("Error: ", error);

  return res.status(500).json({
    error: "Ett oväntat fel uppstod",
  });
}
