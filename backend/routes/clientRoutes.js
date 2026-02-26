// routes/clientRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  addClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  checkEmailExists,
} = require("../controllers/clientController");

// ===== Add client (Admin & Manager) =====
router.post("/", authMiddleware, authorizeRoles("admin", "manager"), addClient);

// ===== Get all clients (All roles) =====
router.get("/", authMiddleware, authorizeRoles("admin", "manager", "staff"), getAllClients);

// ===== Get single client =====
router.get("/:id", authMiddleware, authorizeRoles("admin", "manager", "staff"), getClientById);

// ===== Update client (Admin & Manager) =====
router.put("/:id", authMiddleware, authorizeRoles("admin", "manager"), updateClient);

// ===== Delete client (Admin & Manager) =====
router.delete("/:id", authMiddleware, authorizeRoles("admin", "manager"), deleteClient);

// ===== Optional: Check email (Admin & Manager) =====
router.post("/check-email", authMiddleware, authorizeRoles("admin", "manager"), checkEmailExists);

module.exports = router;