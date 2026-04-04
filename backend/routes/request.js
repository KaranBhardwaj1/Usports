const express = require("express");
const router = express.Router();
const EquipmentRequest = require("../models/EquipmentRequest");
const auth = require("../middleware/authMiddleware");

/* USER REQUEST EQUIPMENT */
router.post("/", auth, async (req, res) => {
  const { equipmentId, universityId } = req.body;

  const request = new EquipmentRequest({
    equipmentId,
    universityId
  });

  await request.save();
  res.json("Request sent");
});

/* USER VIEW OWN REQUESTS */
router.get("/my", auth, async (req, res) => {
  const requests = await EquipmentRequest.find({
    universityId: req.user.universityId
  }).populate("equipmentId", "name");

  res.json(requests);
});

module.exports = router;
