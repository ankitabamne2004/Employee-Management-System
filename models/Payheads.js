const mongoose = require('mongoose');
const payheadSchema = new mongoose.Schema({
    empId: { type: String, required: true },
    empName: { type: String, required: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
    amounts: { type: Object, required: true }, 
    total: {type: Number, required:true}
});
const Payhead = mongoose.model('Payhead', payheadSchema);
module.exports = Payhead;