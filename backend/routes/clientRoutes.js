const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientcontroller");
const authMiddleware = require("../Middleware/authMiddleware");

// =====================================================
// ================= CLIENT ROUTES =====================
// =====================================================

// CREATE CLIENT
router.post("/", authMiddleware, clientController.createClient);

// GET ALL CLIENTS
router.get("/", authMiddleware, clientController.getClients);

// GET SINGLE CLIENT
router.get("/:id", authMiddleware, clientController.getClientById);

// UPDATE CLIENT
router.put("/:id", authMiddleware, clientController.updateClient);

// DELETE CLIENT
router.delete("/:id", authMiddleware, clientController.deleteClient);

// =====================================================
// ================= SERVICE ROUTES ====================
// =====================================================

// ADD NEW SERVICE TO CLIENT
router.post("/:id/services", authMiddleware, clientController.addService);

// UPDATE SINGLE SERVICE
router.put("/:id/services/:serviceId", authMiddleware, clientController.updateService);

// DELETE SINGLE SERVICE
router.delete("/:id/services/:serviceId", authMiddleware, clientController.deleteService);

module.exports = router;