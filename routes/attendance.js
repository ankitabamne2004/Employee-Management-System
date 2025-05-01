const express = require('express');
const router = express.Router();
const attendance = require('../models/attendance'); 

router.get('/attendance',function(req,res){
   const emp_id = req.session.employee;
  //  console.log(req.session.employee)
  res.render('emp-yearly',{type:"emp",emp_id,req})
    
})

router.get('/your-attendance', async function(req, res) {
    const emp_id = req.session.employee;
    //console.log(emp_id)

    const { year, month } = req.query;  // Get year and month from query parameters
  
    // If year and month are not provided, show an error or default behavior
    if (!year || !month) {
      return res.status(400).send('Year and month are required');
    }
  
    // Convert month and year to numbers
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
  
    // Fetch attendance records for the specific employee, year, and month
    let myattendance = await attendance.find({
      emp_id: emp_id,
      date: {
        $gte: new Date(yearNum, monthNum - 1, 1),  // Start of the selected month
        $lte: new Date(yearNum, monthNum, 0, 23, 59, 59)  // End of the selected month
      }
    }).sort({ date: 1 }); // Sort by date in ascending order
  
    //console.log(emp_id)
    res.render('your-attendance', { myattendance ,emp_id});
  });
  
module.exports = router;
  