
var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    // your code here
    username: { type: String, required: true },
    categoryName: { type: String, required: true },
    amount: { type: Number },
    maxAmount: { type: Number },
    color: { type: String, required: true },
    icon: { type: String, required: true } //icon name example:fas fa-wallet
});

module.exports = mongoose.model('Category', CategorySchema);
