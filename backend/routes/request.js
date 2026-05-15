const express = require("express");
const router = express.Router();

const EquipmentRequest = require("../models/EquipmentRequest");

const auth = require("../middleware/authMiddleware");

const sendMail = require("../utils/sendMail");
const generateEmail = require("../utils/generateEmail");


/* USER REQUEST EQUIPMENT */
router.post("/", auth, async (req, res) => {

  const { equipmentId, universityId, name, rollNo, batch } = req.body;

  const request = new EquipmentRequest({
    equipmentId,
    universityId,
    name,
    rollNo,
    batch,
    status: "Pending"
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


/* ADMIN MARK EQUIPMENT BROKEN */

router.put("/broken/:id", async (req, res) => {

  try {

    const reqData = await EquipmentRequest.findById(req.params.id);

    if (!reqData) {
      return res.status(404).json({
        message: "Request not found"
      });
    }

    reqData.status = "Broken";

    await reqData.save();

    const email = generateEmail(
      reqData.name,
      reqData.rollNo,
      reqData.batch
    );

    await sendMail(

      email,

      "Broken Equipment Notice",

`Dear ${reqData.name},

The equipment issued to you has been marked as broken/damaged.

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


module.exports = router;