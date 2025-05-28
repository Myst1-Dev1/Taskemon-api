const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  avatar: String,
  name: String,
  points: Number,
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tasks'
  }],
  awards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Awards'
  }],
  history: [{
    actionType: {
      type: String,
      enum: ['task_completed', 'award_redeemed']
    },
    referenceModel: {
      type: String,
      enum: ['Tasks', 'Awards'],
      required: true
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'history.referenceModel'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('User', UserSchema);