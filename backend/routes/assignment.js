const router = require("express").Router();
const Assignment = require("../models/Assignment");
const Equipment = require("../models/Equipment");
const auth = require("../middleware/authMiddleware");

// ASSIGN EQUIPMENT (ADMIN)
router.post("/assign", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json("Admin only");

  const { equipmentId, universityId } = req.body;

  await Equipment.findByIdAndUpdate(equipmentId, {
    available: false
  });

  const assignment = new Assignment({
    equipmentId,
    universityId
  });

  await assignment.save();
  res.json("Equipment assigned");
});

// RETURN EQUIPMENT (ADMIN)
router.post("/return/:id", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json("Admin only");

  const assignment = await Assignment.findById(req.params.id);

  assignment.status = "returned";
  assignment.returnedAt = new Date();
  await assignment.save();

  await Equipment.findByIdAndUpdate(assignment.equipmentId, {
    available: true
  });

  res.json("Equipment returned");
});

module.exports = router;

// GET ACTIVE ASSIGNMENTS (ADMIN)
router.get("/active", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json("Admin only");

  const assignments = await Assignment.find({ status: "assigned" })
    .populate("equipmentId", "name");

  res.json(assignments);
});
