const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        unique: true // Each category can only have one budget
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Budget', budgetSchema);