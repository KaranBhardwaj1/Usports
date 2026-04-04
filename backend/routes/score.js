const express = require("express");
const router = express.Router();
const Score = require("../models/Score");

// CREATE MATCH
router.post("/", async (req, res) => {
  const match = await Score.create(req.body);
  res.json(match);
});

// GET LIVE MATCH
router.get("/live", async (req, res) => {
  const match = await Score.findOne({ status: "Live" });
  res.json(match);
});

// UPDATE MATCH
router.put("/:id", async (req, res) => {
  const updated = await Score.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// FINISHED MATCHES
router.get("/history", async (req, res) => {
  try {
    const matches = await Score.find({ status: "Finished" })
      .sort({ createdAt: -1 });

    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;