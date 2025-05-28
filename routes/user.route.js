const express = require('express');
const { findUserByName, createUser, getUserData, completeTask, redeemAward } = require('../controller/user.controller');

const router = express.Router();

router.get("/findUser/:name", findUserByName);
router.get("/:id", getUserData);
router.post("/createUser", createUser);
router.post('/completeTask', completeTask);
router.post('/redeemAward', redeemAward);

module.exports = router;