const express = require("express");
const router = express.Router();
const machinesController = require("../controllers/machinesController.js");

// GET
router.get("/", machinesController.getAllMachines);
router.get("/:id", machinesController.getMachineById);
router.get("/type/:type", machinesController.getMachinesByType);

// POST
router.post("/", machinesController.createMachine);

// PUT
router.put("/:id", machinesController.updateMachine);

// DELETE
router.delete("/:id", machinesController.deleteMachineById);

module.exports = router;
