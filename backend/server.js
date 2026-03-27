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

// ✅ FINAL CORS FIX (Correct way)
app.use(
  cors({
    origin: [
      "https://softwings-management-8x4a-sigma.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight (VERY IMPORTANT)
app.options("*", cors());

app.use(express.json());

// -------------------------
// Routes
// -------------------------

const userRoutes = require("./routes/userRoutes");
const clientRoutes = require("./routes/clientRoutes");
const renewalRoutes = require("./routes/renewalRoutes");
const reportRoutes = require("./routes/reportRoutes");
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

app.get("/", (req, res) => {
  res.json({ message: "Backend is running ✅" });
});

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