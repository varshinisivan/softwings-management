// registerUser.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js"; // adjust path if needed

dotenv.config();

// -----------------------
// CONFIG
// -----------------------
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/softwings";

// User info to register
const NEW_USER = {
  name: "Charu",
  email: "charu@gmail.com",
  password: "123456",   // you can change this
  role: "admin",        // staff, manager, or admin
  isActive: true,
};

// -----------------------
// CONNECT TO MONGO
// -----------------------
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// -----------------------
// REGISTER USER
// -----------------------
const registerUser = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: NEW_USER.email });
    if (existingUser) {
      console.log("User already exists!");
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NEW_USER.password, salt);

    // Create user
    const user = new User({
      ...NEW_USER,
      password: hashedPassword,
    });

    await user.save();
    console.log(`User ${NEW_USER.email} registered successfully!`);
    process.exit(0);
  } catch (err) {
    console.error("Error registering user:", err);
    process.exit(1);
  }
};

registerUser();