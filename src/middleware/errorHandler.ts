import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  const details = (typeof err === "object" && err !== null ? err : {}) as {
    type?: string;
    code?: number;
  };

  if (details.type === "entity.parse.failed") {
    res.status(400).json({ error: "Invalid JSON in request body" });
    return;
  }

  if (details.type === "entity.too.large") {
    res.status(413).json({ error: "Request body is too large" });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: `Invalid value for ${err.path}` });
    return;
  }

  if (details.code === 11000) {
    res.status(409).json({ error: "A record with that value already exists" });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Server error" });
}