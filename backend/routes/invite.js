const express = require("express");
const router = express.Router();
const Invite = require("../models/Invite");

// CREATE INVITE
router.post("/", async (req, res) => {
  const invite = new Invite(req.body);
  await invite.save();
  res.json(invite);
});

// GET ACTIVE INVITES (last 2 hours)
router.get("/", async (req, res) => {

  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  const invites = await Invite.find({
    createdAt: { $gte: twoHoursAgo }
  }).sort({ createdAt: -1 });

  res.json(invites);
});

module.exports = router;