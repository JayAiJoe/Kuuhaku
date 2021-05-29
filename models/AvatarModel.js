var mongoose = require('mongoose');

var AvatarSchema = new mongoose.Schema({
    // your code here
    username: {type: String, required: true},
    //haircolor: {type: String, default: 'black'},
    hairf: {type: Number, default: 1},
    hairb: {type: Number, default: 1},
    face: {type: Number, default: 1},
    outfit: {type: Number, default: 1},
    gender: {type: String, default: 'male'}
});

module.exports = mongoose.model('Avatar', AvatarSchema);
