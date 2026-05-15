const router = require("express").Router();
const Assignment = require("../models/Assignment");
const Equipment = require("../models/Equipment");
const auth = require("../middleware/authMiddleware");

// ASSIGN EQUIPMENT (ADMIN)
router.post("/assign", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json("Admin only");

  const { equipmentId, universityId, name } = req.body;

  await Equipment.findByIdAndUpdate(equipmentId, {
    available: false
  });

  const assignment = new Assignment({
  equipmentId,
  universityId,
  name
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

const sendMail = require("../utils/sendMail");

router.put("/broken/:id", async (req, res) => {

  try {

    const Assignment = require("../models/Assignment");

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {

      return res.status(404).json({
        message: "Assignment not found"
      });

    }

    assignment.status = "broken";

    await assignment.save();

    const universityId = assignment.universityId;

    const last4 = universityId.slice(-4);

    // Example email generation
    const studentName =
  assignment.name.toLowerCase().replace(/\s/g, "");

// batch from first 2 digits
const batch = universityId.slice(0, 2);

const email =
`${studentName}${last4}.be${batch}@chitkarauniversity.edu.in`;

    await sendMail(

      email,

      "Broken Equipment Notice",

`Your assigned equipment has been marked as broken.

Please contact sports administration.

uSports Team`

    );

    res.json({
      message: "Broken status updated and email sent"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error"
    });

  }

});

// GET ACTIVE ASSIGNMENTS (ADMIN)
router.get("/active", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json("Admin only");

  const assignments = await Assignment.find({ status: "assigned" })
    .populate("equipmentId", "name");

  res.json(assignments);
});
