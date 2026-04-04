const express = require("express");
const router = express.Router();
const PoolTable = require("../models/PoolTable");
const PoolBooking = require("../models/PoolBooking");
const auth = require("../middleware/authMiddleware");

/* GET POOL STATUS */
router.get("/status", async (req, res) => {
  const tables = await PoolTable.find();
  res.json(tables);
});

/*Book Table*/
router.post("/book", auth, async (req, res) => {
  const { name, universityId } = req.body;

  if (!name || !universityId) {
    return res.status(400).json("Missing details");
  }

  // find available table
  const table = await PoolTable.findOne({ available: true });

  if (!table) {
    return res.status(400).json("All pool tables are booked");
  }

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 20 * 60000); // 1 hour

  table.available = false;
  await table.save();

  await PoolBooking.create({
    name,
    universityId,
    tableNumber: table.tableNumber,
    startTime,
    endTime,
    amount: 50
  });

  res.json("Booking successful");
});



module.exports = router;

/* ADMIN VIEW ALL POOL BOOKINGS */
router.get("/admin/bookings", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json("Admin only");
  }

  const bookings = await PoolBooking.find().sort({ startTime: -1 });
  res.json(bookings);
});

