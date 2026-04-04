const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("frontend"));



// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/equipment", require("./routes/equipment"));
app.use("/api/assignment", require("./routes/assignment"));
app.use("/api/request", require("./routes/request"));
app.use("/api/pool", require("./routes/pool"));
app.use("/api/invite", require("./routes/invite"));

// 🔥 NEW ROUTES FOR LIVE SCORES
app.use("/api/org", require("./routes/orgAuth"));
app.use("/api/score", require("./routes/score"));

// MongoDB
mongoose.connect("process.env.MONGO_URI")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// Socket connection
const Score = require("./models/Score"); // make sure path correct

io.on("connection", async (socket) => {
  console.log("User connected");

  // 🔥 SEND CURRENT LIVE MATCH ON CONNECT
  const liveMatch = await Score.findOne({ status: "Live" }).sort({ createdAt: -1 });

  if (liveMatch) {
    socket.emit("scoreUpdated", liveMatch);
  }

  // CREATE
 socket.on("scoreCreated", async () => {
  try {
    const latest = await Score.findOne({ status: "Live" }).sort({ createdAt: -1 });

    if (latest) {
      io.emit("scoreUpdated", latest);
    }
  } catch (err) {
    console.error(err);
  }
});

  // UPDATE
 socket.on("scoreUpdated", async () => {
  try {
    const latest = await Score.findOne({ status: "Live" }).sort({ createdAt: -1 });

    if (latest) {
      io.emit("scoreUpdated", latest);
    }
  } catch (err) {
    console.error(err);
  }
});

socket.on("sendInvite", (data) => {
  console.log("Invite:", data);

  // send to all users
  io.emit("receiveInvite", data);
});
});

// Auto expire pool bookings
setInterval(async () => {
  const now = new Date();

  const expired = await require("./models/PoolBooking").find({
    endTime: { $lte: now }
  });

  for (let b of expired) {
    await require("./models/PoolTable").updateOne(
      { tableNumber: b.tableNumber },
      { available: true }
    );
  }
}, 60000);

setInterval(async () => {
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

  await Invite.deleteMany({
    createdAt: { $lt: twoHoursAgo }
  });

}, 600000); // every 10 min

// Root
app.get("/", (req, res) => {
  res.send("Server working");
});

// 🔥 IMPORTANT: Use server.listen NOT app.listen
server.listen(5000, "0.0.0.0", () => {
  console.log("🚀 Server running on port 5000");
});
