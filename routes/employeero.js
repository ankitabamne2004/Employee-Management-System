// employeeRoutes.js (employeero.js)
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Payhead = require('../models/Payheads'); // Make sure you have the correct path to your Payhead model

// Route for employee payroll
router.get('/payroll', (req, res) => {
    const emp_id = req.session.employee;
    // console.log(emp_id)
    res.render('emppayroll', {
        emp_id
        // Assuming emp_id is stored in the session
    });
});
router.get('/salary-slip/:month/:year', async (req, res) => {
    const { month, year } = req.params;
    const empId = req.session.employee;

    const recordFound = await Payhead.findOne({ empId, year, month });
    if (!recordFound) {
        return res.render('salary-slip-not-found.ejs');
    } else {
        const { empId, month, year, empName, amounts } = recordFound;
        res.render('confirm-payheads', {
            empId,
            empName,
            month,
            year,
            amounts,
            type: 'employee',
        });
    }
});
module.exports = router;