const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    points: Number
});

module.exports = mongoose.model('Tasks', TaskSchema);