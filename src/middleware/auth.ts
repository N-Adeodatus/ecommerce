import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export function protect(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const token = header.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not defined in .env");
    res.status(500).json({ error: "Server error" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });

    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "string" ||
      typeof decoded.role !== "string"
    ) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}