const express = require('express');
const { findUserByName, createUser, getUserData } = require('../controller/user.controller');

const router = express.Router();

router.get("/findUser/:name", findUserByName);
router.get("/:id", getUserData);
router.post("/createUser", createUser);

module.exports = router;