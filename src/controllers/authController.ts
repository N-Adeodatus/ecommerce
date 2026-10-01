import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/User";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({ error: "name, email and password are required strings" });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      res.status(409).json({ error: "Email is already registered" });
      return;
    }

    const user = await User.create({ name, email: normalizedEmail, password });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}