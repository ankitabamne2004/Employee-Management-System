const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  emp_id: String,
  username: String,
  password: String,
  email: String,
  salary: Number,
  address: String,
  number: String
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
