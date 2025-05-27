const mongoose = require('mongoose');

const AwardsSchema = new mongoose.Schema({
    awardImg: String,
    awardTitle: String,
    awardPoints: Number
});

module.exports = mongoose.model('Awards', AwardsSchema);