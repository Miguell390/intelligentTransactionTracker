// backend/models/Transaction.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: [true, 'Please add some text']
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive or negative number']
    },
    // We will make the category optional for now.
    // In Week 2, the Gemini API will populate this field automatically.
    category: {
        type: String,
        default: 'Other'
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);