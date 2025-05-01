const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  emp_id: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
