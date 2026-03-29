const express = require("express");
const router = express.Router();

const { getDashboardOverview } = require("../controllers/dashboardController");
const authMiddleware = require("../Middleware/authMiddleware");

// ✅ MAIN ROUTE (fixes your frontend issue)
router.get("/", authMiddleware, getDashboardOverview);

// ✅ OPTIONAL (keep this if already used somewhere)
router.get("/overview", authMiddleware, getDashboardOverview);

module.exports = router;