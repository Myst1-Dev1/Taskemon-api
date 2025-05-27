const express = require('express');
const { createAward, updateAward, deleteAward } = require('../controller/awards.controller');

const router = express.Router();

router.post("/createAward", createAward);
router.put("/updateAward/:id", updateAward);
router.delete("/deleteAward/:id", deleteAward);

module.exports = router;