// registerUser.js - CommonJS version
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.js");

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/softwings-management";

// User info to register
const NEW_USER = {
  name: "Admin User",
  email: "admin@softwings.com",
  password: "admin123",
  role: "admin",
  isActive: true,
};

async function registerUser() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if user already exists
    const existingUser = await User.findOne({ email: NEW_USER.email });
    if (existingUser) {
      console.log(`⚠️  User ${NEW_USER.email} already exists!`);
      console.log("You can login with:");
      console.log(`📧 Email: ${NEW_USER.email}`);
      console.log(`🔑 Password: ${NEW_USER.password}`);
      return;
    }

    // Hash password
    console.log("🔄 Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NEW_USER.password, salt);

    // Create user
    const user = new User({
      ...NEW_USER,
      password: hashedPassword,
    });

    await user.save();
    console.log(`✅ User ${NEW_USER.email} registered successfully!`);
    console.log("\n🚀 LOGIN CREDENTIALS:");
    console.log(`📧 Email: ${NEW_USER.email}`);
    console.log(`🔑 Password: ${NEW_USER.password}`);
    console.log(`👤 Role: ${NEW_USER.role}`);

  } catch (error) {
    console.error("❌ Error registering user:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

registerUser();