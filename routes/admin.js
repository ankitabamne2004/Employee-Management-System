const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee'); 
const Leave = require('../models/Leave');
const nodemailer = require('nodemailer');
const Attendance = require('../models/attendance');

// Route to display all employees
router.get('/admin/employees/all', async (req, res) => {
  try {
    const employees = await Employee.find(); 
    res.render('all-employees', { employees });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Configure Nodemailer transport (for Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bhagyashreechadiwal@gmail.com', 
    pass: 'bvkl szic ytsg avzp'   
  }
});

// Fetch all leave applications
router.get('/leave-applications', async (req, res) => {
  try {
    const leaves = await Leave.find(); 
    res.render('leave-applications', { leaves });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// Accept or Reject leave application with email notification
router.post('/leave-applications/:id/:action', async (req, res) => {
  const { id, action } = req.params;
  const status = action === 'accept' ? 'Accepted' : 'Rejected';

  try {
    // Update the leave status
    const leaveApplication = await Leave.findByIdAndUpdate(id, { status }, { new: true });

    if (leaveApplication) {
      // Email options
      // const mailOptions = {
      //   from: 'bhagyashreechadiwal@gmail.com',
      //   to: leaveApplication.email, // Employee's email from the leave application
      //   subject: `Leave Application ${status}`,
      //   text: `Dear Employee,\n\nYour leave application for ${leaveApplication.startDate} to ${leaveApplication.endDate} has been ${status.toLowerCase()} by the admin.\n\nBest Regards,\nCompany HR`
      // };

      const formattedStartDate = new Date(leaveApplication.startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(leaveApplication.endDate).toISOString().split('T')[0];

      const mailOptions = {
        from: 'bhagyashreechadiwal@gmail.com',
        to: leaveApplication.email, // Employee's email from the leave application
        subject: `Leave Application ${status}`,
        text: `Dear Employee,\n\nYour leave application for ${formattedStartDate} to ${formattedEndDate} has been ${status.toLowerCase()} by the admin.\n\nBest Regards,\nCompany HR`
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

    // Redirect back to the leave applications page
    res.redirect('/admin/leave-applications');
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).send('Server Error');
  }
});
// Route to display the Add Payheads page
router.get('/add-payhead/:empId', async (req, res) => {
  try {
    const empId = req.params.empId;
    const employee = await Employee.findOne({ emp_id: empId });
    if (employee) {
      res.render('add-payhead', {
        empId: employee.emp_id,
        empName: employee.username,
        month: req.query.month,  
        year: req.query.year,     
        leaveduction: ld
      });
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).send('Server error');
  }
});
module.exports = router;
