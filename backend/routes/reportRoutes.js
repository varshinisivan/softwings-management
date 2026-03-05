const express = require("express");
const router = express.Router();
const { getProfitReport } = require("../controllers/reportController");

// GET /api/reports/profit
router.get("/profit", getProfitReport);

module.exports = router;