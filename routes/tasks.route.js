const express = require('express');
const { createTask, updateTask, deleteTask } = require('../controller/tasks.controller');

const router = express.Router();

router.post("/createTask", createTask);
router.put("/updateTask/:id", updateTask);
router.delete("/deleteTask/:id", deleteTask);

module.exports = router;