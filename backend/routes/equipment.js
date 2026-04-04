const express = require("express");
const Equipment = require("../models/Equipment");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ADD equipment (ADMIN)
router.post("/add", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json("Admin access only");

  const equipment = new Equipment(req.body);
  await equipment.save();
  res.json("Equipment added");
});

// UPDATE availability (ADMIN)
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json("Admin access only");

  await Equipment.findByIdAndUpdate(req.params.id, req.body);
  res.json("Equipment updated");
});

// VIEW equipment (USER)
router.get("/", auth, async (req, res) => {
  const equipment = await Equipment.find();
  res.json(equipment);
});

module.exports = router;
