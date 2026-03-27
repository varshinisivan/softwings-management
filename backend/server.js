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

// ✅ FIXED CORS (Allow all for now - no more network error)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

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

// Profit Report Routes
const reportRoutes = require("./routes/reportRoutes");

// Dashboard Routes
const dashboardRoutes = require("./routes/dashboardRoutes");

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/renewals", renewalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);

// -------------------------
// Test Routes
// -------------------------

// Root test
app.get("/", (req, res) => {
  res.json({ message: "Backend is running ✅" });
});

// API test (IMPORTANT)
app.get("/api", (req, res) => {
  res.json({ message: "API is working ✅" });
});

// -------------------------
// MongoDB Connection
// -------------------------

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MongoDB connection failed: MONGO_URI is not defined!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

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
  console.error("Global Error:", err.stack || err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});