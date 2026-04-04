const express = require("express");
const router = express.Router();
const Organisation = require("../models/Organisation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const org = await Organisation.findOne({ email });
  if (!org) return res.status(400).json({ msg: "Not found" });

  const match = await bcrypt.compare(password, org.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  const token = jwt.sign({ id: org._id }, "secret", { expiresIn: "1d" });

  res.json({ token });
});

module.exports = router;