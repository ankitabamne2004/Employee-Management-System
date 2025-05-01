const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    emp_id: String,
    customerName: String,
    feedbackText: String,
    rating: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
