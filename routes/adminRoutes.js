const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee'); // Assuming an Employee model is defined
const adminAuth = require('../middleware/adminAuth');
const nodemailer = require('nodemailer');

// Ensure the user is authenticated as an admin
router.use(adminAuth);

// Render Home Page
router.get('/home', (req, res) => {
  res.render('admin-dashboard', {
    content: `
      <h1>Microsoft Corporation</h1>
      <p>TECHNOLOGY COMPANY</p>
      <p>
        Microsoft Corporation is an American multinational technology company with headquarters in Redmond, Washington. It develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.
      </p>
    `
  });
});

// Render Add Employee form
router.get('/add-employee', (req, res) => {
  res.render('admin-dashboard', {
    content: `
      <h1>Add Employee</h1>
      <form action="/admin/add-employee" method="post">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="email" name="email" placeholder="Email" required>
        <input type="number" name="salary" placeholder="Salary" required>
        <input type="text" name="address" placeholder="Address" required>
        <input type="text" name="number" placeholder="Phone Number" required>
        <button type="submit">Add Employee</button>
      </form>
    `
  });
});

// Render All Employees page (example, to be implemented)
// Render Payroll page (example, to be implemented)
router.get('/payroll', (req, res) => {
  res.render('admin-dashboard', {
    content: '<p>Payroll content goes here</p>'
  });
});

// Render Leave Applications page (example, to be implemented)
router.get('/admin/leave-applications', (req, res) => {
  res.render('admin-dashboard', {
    content: '<p>Leave Applications content goes here</p>'
  });
});

// Handle Logout
router.get('/logout', (req, res) => {
  req.logout(); // or destroy session
  res.redirect('/');
});

module.exports = router;