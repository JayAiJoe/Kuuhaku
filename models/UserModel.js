
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    // your code here
    username: { type: String, required: true },
    password: { type: String, required: true },
    displayname: { type: String, required: true },
    level: { type: Number, required: true },
    hp: { type: Number, required: true },
    maxHp: { type: Number, required: true },
    xp: { type: Number, required: true },
    maxXp: { type: Number, required: true }
});

module.exports = mongoose.model('User', UserSchema);
