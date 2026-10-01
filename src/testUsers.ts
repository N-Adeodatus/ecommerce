import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { User } from "./models/User";

async function run(): Promise<void> {
  await connectDB();

  const user = await User.create({
    name: "Test User",
    email: "Test@Example.com",
    password: "secret123",
  });

  console.log(user);
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});