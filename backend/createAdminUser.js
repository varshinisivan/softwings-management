// createAdminUser.js - Production Admin User Creation
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");

// Production MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://softwings:softwings123@softwingscluster.u2w7yqm.mongodb.net/softwings-management?retryWrites=true&w=majority";

// Admin user details
const ADMIN_USER = {
  name: "Administrator",
  email: "admin@softwings.com",
  password: "admin123",
  role: "admin",
  isActive: true,
};

async function createAdminUser() {
  try {
    console.log("🔄 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_USER.email });
    if (existingAdmin) {
      console.log(`⚠️  Admin user ${ADMIN_USER.email} already exists!`);
      console.log("You can login with:");
      console.log(`📧 Email: ${ADMIN_USER.email}`);
      console.log(`🔑 Password: ${ADMIN_USER.password}`);
      return;
    }

    // Hash password
    console.log("🔄 Hashing password...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_USER.password, salt);

    // Create admin user
    const adminUser = new User({
      ...ADMIN_USER,
      password: hashedPassword,
    });

    await adminUser.save();
    console.log(`✅ Admin user ${ADMIN_USER.email} created successfully!`);
    console.log("\n🚀 PRODUCTION LOGIN CREDENTIALS:");
    console.log(`📧 Email: ${ADMIN_USER.email}`);
    console.log(`🔑 Password: ${ADMIN_USER.password}`);
    console.log(`👤 Role: ${ADMIN_USER.role}`);
    console.log(`🌐 Production URL: https://softwings-management.vercel.app`);

  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

createAdminUser();