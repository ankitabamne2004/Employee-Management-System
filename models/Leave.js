// models/Leave.js
const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  emp_id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  numberOfDays: { type: Number, required: true },
  leaveType: { type: String, required: true },
  otherReason: { type: String,default:null },
  status: { type: String, default: 'Pending' } // 'Pending', 'Approved', 'Rejected'
});

module.exports = mongoose.model('Leave', LeaveSchema);
