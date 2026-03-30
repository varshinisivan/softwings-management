const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// -------------------------
// ✅ CORS FIX (SAFE VERSION)
// -------------------------

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173", 
      "https://softwings-management.vercel.app",
      "https://softwings-management-git-main-varshinisivans-projects.vercel.app",
      "https://softwings-management-ram1.onrender.com",
      // Add wildcard for Vercel preview deployments
      /^https:\/\/softwings-management.*\.vercel\.app$/,
      // Allow all localhost ports for development
      /^http:\/\/localhost:\d+$/,
      // Allow all Vercel domains
      /^https:\/\/.*\.vercel\.app$/
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// -------------------------
// Middleware
// -------------------------

app.use(express.json());

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

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
  res.json({ 
    message: "Backend is running ✅",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get("/api", (req, res) => {
  res.json({ 
    message: "API is working ✅",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
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