const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// -------------------------
// Middleware
// -------------------------
app.use(cors());
app.use(express.json());

// -------------------------
// Routes
// -------------------------

// User Routes
const userRoutes = require("./routes/userRoutes");

// Client Routes
const clientRoutes = require("./routes/clientRoutes");

// Renewal Routes
const renewalRoutes = require("./routes/renewalRoutes");

// ✅ Profit Report Routes (NEW)
const reportRoutes = require("./routes/reportRoutes");
//Dashboard Routes
const dashboardRoutes = require("./routes/dashboardRoutes");

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/renewals", renewalRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ✅ Mount Report Route
app.use("/api/reports", reportRoutes);

// -------------------------
// Test Route
// -------------------------
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// -------------------------
// MongoDB Connection
// -------------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/softwings";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });

// -------------------------
// Global Error Handler
// -------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
  });
});