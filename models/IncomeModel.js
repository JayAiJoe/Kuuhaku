
var mongoose = require('mongoose');

var IncomeSchema = new mongoose.Schema({
    // your code here
    username: {type: String, required: true},
    description: {type: String, required: true},
    date: { type: Date, default: Date.now },
    amount: {type: Number}
});

module.exports = mongoose.model('Income', IncomeSchema);
