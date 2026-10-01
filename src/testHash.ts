import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { User } from "./models/User";

async function run(): Promise<void> {
  await connectDB();

  const email = `hash-${Date.now()}@example.com`;
  await User.create({ name: "Hash Test", email, password: "secret123" });

  const saved = await User.findOne({ email }).select("+password");
  if (!saved) throw new Error("User not found");

  console.log("Stored value:", saved.password);
  console.log("Correct password matches:", await bcrypt.compare("secret123", saved.password));
  console.log("Wrong password matches:", await bcrypt.compare("wrong-password", saved.password));

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});