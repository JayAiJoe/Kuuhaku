var mongoose = require('mongoose');

var RewardSchema = new mongoose.Schema({
    // your code here
    username: {type: String, required: true},
    rewardname: {type: String, required: true},
});

module.exports = mongoose.model('Reward', RewardSchema);
