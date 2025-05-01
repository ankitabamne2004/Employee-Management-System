const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
sequence_value : Number
},{ collection: 'counter' });


const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
