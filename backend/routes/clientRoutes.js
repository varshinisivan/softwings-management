const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");


// =====================================================
// ================= CLIENT ROUTES =====================
// =====================================================

// CREATE CLIENT
router.post("/", clientController.createClient);

// GET ALL CLIENTS
router.get("/", clientController.getClients);

// GET SINGLE CLIENT
router.get("/:id", clientController.getClientById);

// UPDATE CLIENT
router.put("/:id", clientController.updateClient);

// DELETE CLIENT
router.delete("/:id", clientController.deleteClient);



// =====================================================
// ================= SERVICE ROUTES ====================
// =====================================================

// ADD NEW SERVICE TO CLIENT
router.post("/:id/services", clientController.addService);

// UPDATE SINGLE SERVICE
router.put("/:id/services/:serviceId", clientController.updateService);

// DELETE SINGLE SERVICE
router.delete("/:id/services/:serviceId", clientController.deleteService);



module.exports = router;