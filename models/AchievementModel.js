var mongoose = require('mongoose');

var AchievementSchema = new mongoose.Schema({
    // your code here
    name: {type: String, required: true},
    description: {type: String},
    countType: {type: String},
    condition: {type: Object},
    goal: {type: Number}   	
});

module.exports = mongoose.model('Achievement', AchievementSchema);
