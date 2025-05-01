const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const Employee = require('./models/Employee');
const Admin = require('./models/admin');
const Empattendance = require('./routes/attendance');
const Counter = require('./models/counter');
const AdminRoutes = require('./routes/admin');
const Leave = require('./models/Leave');
const Attendance = require('./models/attendance');
const Payhead = require('./models/Payheads')
const employeeRoutes = require('./routes/employeero');
const QRCode = require('qrcode');
const Feedback = require('./models/feedback');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { DateTime } = require('luxon');
const cors = require('cors');
app.use(cors());
// Middleware setup
 app.use(express.json());

 app.set('view engine', 'ejs');
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(session({ secret: 'yourSecretKey', resave: false, saveUninitialized: true }));
 app.use(express.static('public'));
 app.use('/admin', AdminRoutes);

const notification = require('./routes/notification');
app.use('/admin', notification);
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/employeeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Authentication middleware
const isAuthenticatedAdmin = (req, res, next) => {
  if (req.session && req.session.admin) {
    return next();
  } else {
    res.redirect('/admin/login');
  }
};

const isAuthenticatedEmployee = (req, res, next) => {
  if (req.session && req.session.employee) {
    return next();
  } else {
    res.redirect('/employee/login');
  }
};

// Routes
app.get('/', (req, res) => {
  res.render('index'); // Home page with admin and employee login buttons
});

// Admin login page
app.get('/admin/login', (req, res) => {
  res.render('admin-login');
});

// Admin login logic
app.post('/admin/login', async (req, res) => {
  const adminCredentials = await Admin.findOne({});

  const { username, password } = req.body;
  if (username === adminCredentials.username && password === adminCredentials.password) {
    req.session.admin = username;
    res.redirect('/admin/dashboard');
  } else {
    res.render('error',{errorMessage:"WRONG CREDENTIALS!"}); 
  }
});

// Admin dashboard
app.get('/admin/dashboard', isAuthenticatedAdmin, async (req, res) => {
  res.render('admin-dashboard');
});


// Add employee page
app.get('/admin/add-employee', isAuthenticatedAdmin, (req, res) => {
  res.render('add-employee');
});


// Add employee logic
app.post('/admin/add-employee', isAuthenticatedAdmin, async (req, res) => {
  const { username, password, email, salary, address, number } = req.body;

  try {
    // Fetch the current counter value for generating emp_id
    const output = await Counter.findOne({});
    const count = output.sequence_value;
    const newcount = count + 1;
    const emp_id = `EMP${newcount}`; // Example emp_id generation
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new employee in the database
    const newEmployee = new Employee({
      emp_id,
      username,
      password: hashedPassword,
      email,
      salary,
      address,
      number,
    });

    await newEmployee.save();
    // Update the sequence counter
    await Counter.findOneAndUpdate({ sequence_value: count }, { sequence_value: newcount });

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Replace with your email provider if not Gmail
      auth: {
        user: 'bhagyashreechadiwal@gmail.com', // Your email
        pass: 'bvkl szic ytsg avzp', // Your email's app password
      },
    });

    // Email content
    const mailOptions = {
      from: 'bhagyashreechadiwal@gmail.com', // Your email
      to: email, // Employee's email from the form
      subject: 'Welcome to the Employee Management System!',
      text: `
        Dear ${username},

        Welcome to the Employee Management System (EMS)!

        Here are your details:
        - Employee ID: ${emp_id}
        - Username: ${username}
        - Password: ${password} 
        - Salary: ${salary}
        - Address: ${address}
        - Phone Number: ${number}

        Please log in to the EMS system using your username and password. For any queries, feel free to contact the admin.

        Regards,
        Admin
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully to:', email);

    // Redirect to admin dashboard
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error adding employee or sending email:', error);
    res.status(500).send('An error occurred while adding the employee or sending the email.');
  }
});

// Employee login page
app.get('/employee/login', (req, res) => {
  res.render('employee-login');
});

// Employee login logic
app.post('/employee/login', async (req, res) => {
  const { emp_id, username, password, email } = req.body;
  const employee = await Employee.findOne({ emp_id, username, email });

  if (employee && await bcrypt.compare(password, employee.password)) {
    req.session.employee = emp_id;
    res.redirect(`/employee/dashboard/${emp_id}`);
  } else {
    res.render('error',{errorMessage:"WRONG CREDENTIALS!"}); 
  }
});

// Employee dashboard
app.get('/employee/dashboard/:emp_id', isAuthenticatedEmployee, async (req, res) => {
  const { emp_id } = req.params;
  const employee = await Employee.findOne({ emp_id });

  if (employee) {
    res.render('employee-dashboard', { employee });
  } else {
    res.send('Employee not found');
  }
});

// Render the apply leave form
app.get('/employee/apply-leave', isAuthenticatedEmployee, async (req, res) => {
  try {
      const emp_id = req.session.employee; // Assuming emp_id is stored in the session after login
      const employee = await Employee.findOne({ emp_id });

      if (!employee) {
          return res.status(404).send('Employee not found');
      }

      res.render('apply-leave', { employee }); // Pass the employee data to the view
  } catch (error) {
      res.status(500).send('Server Error');
  }
});

app.get('/api/employees', async (req, res) => {
  try {
      const employees = await Employee.find();
      res.json(employees);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
});

app.get('/admin/employees/edit/:id', async (req, res) => {
  try {
      const employee = await Employee.findById(req.params.id);
      res.render('edit-employee', { employee });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

app.post('/admin/employees/edit/:id', async (req, res) => {
  try {
      await Employee.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/admin/employees/all');
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});

app.delete('/api/employees/delete/:id', async (req, res) => {
  try {
      await Employee.findByIdAndDelete(req.params.id);
      res.status(200).send('Employee deleted');
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
  }
});

app.get('/admin/payroll', async (req, res) => {
  const employees = await Employee.find();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  res.render('payroll-dashboard', {employees, months,req});
});

// In your Express app (e.g., app.js or routes file)
app.get('/admin/add-payhead/:month/:year/:empId/:ename', async (req, res) => {
  // console.log("hello");
  const { empId, month, year, ename } = req.params;
  const recordFound = await Payhead.findOne({ empId, year, month })
  if (recordFound) {
    // console.log(recordFound);
    
    const { empId, month, year, empName, amounts } = recordFound;
    res.render('confirm-payheads', {
      empId,
      empName,
      month,
      year,
      amounts,
      type: 'admin',
  });
  } else {  
    const monthMap = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11
  };

    // If year and month are not provided, show an error or default behavior
    if (!year || !month) {
      return res.status(400).send('Year and month are required');
    }
  
    // Convert month and year to numbers
    const yearNum = parseInt(year);
    const monthNum = parseInt(monthMap[month]);
  
    // Fetch attendance records for the specific employee, year, and month
    let myattendance = await Attendance.find({
      emp_id: empId,
      status: "Absent",
      date: {
        $gte: new Date(yearNum, monthNum,1),
        $lte: new Date(yearNum, monthNum+1,0,23, 59, 59)  // End of the selected month
      }
    })
    let ld=0
    if (myattendance.length>3){
       console.log(myattendance.length);
       let extraleave=myattendance.length-3 
       ld = 500*extraleave
    }
    res.render('add-payhead', { empId, empName: ename , month, year,ld});
  }
});

app.post('/submit-payheads', async (req, res) => {
  const { empId, empName, month, year, amounts ={} } = req.body;
  // console.log(amounts);
  const payheads = Object.keys(amounts);
  let total = 0;
  // console.log(payheads)
  payheads.forEach(payhead => { 
       let amount = parseFloat(amounts[payhead]) || 0;
      if (payhead === 'Income Tax' || payhead === 'Leave Deduction') {
          
          total -= amount;
      } else {
     
           total += amount; 
       } 
      })
  const newPayhead = new Payhead({
    empId,
    empName,
    month,
    year,
    amounts,
    total
});

await newPayhead.save();

  res.render('confirm-payheads', {
      empId,
      empName,
      month,
      year,
      amounts,
 
  });
});

// Route to check if payroll is already processed
app.get('/api/payroll-status/:employeeId/:month/:year', async (req, res) => {
  try {
      const { employeeId, month, year } = req.params;
      const payroll = await Payhead.findOne({
          empId: employeeId,
          month: month,
          year: year
      });

      if (payroll) {
          res.json({ status: 'processed' });
      } else {
          res.json({ status: 'not_processed' });
      }
  } catch (error) {
      console.error('Error checking payroll status:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/admin/leave-records', (req, res) => {
  try {
      res.render('admin-leave-history'); // Ensure leave-records.ejs is in the "views" folder
  } catch (error) {
      console.error('Error rendering Leave Records page:', error);
      res.status(500).send('Internal Server Error');
  }
});

app.get('/employee/apply-leave', isAuthenticatedEmployee, (req, res) => {
  res.render('apply-leave');
});

app.post('/employee/apply-leave', isAuthenticatedEmployee, async (req, res) => {
  const { emp_id, firstName, lastName, email, startDate, endDate, numberOfDays, leaveType, otherReason} = req.body;

  const newLeave = new Leave({
    emp_id,
    firstName,
    lastName,
    email,
    startDate,
    endDate,
    numberOfDays,
    leaveType,
    otherReason: leaveType === 'Other' ? otherReason : null
  });

  await newLeave.save();
  res.redirect(`/employee/dashboard/${emp_id}`);
});

// Admin views all leave applications
app.get('/admin/leaves', isAuthenticatedAdmin, async (req, res) => {
  try {
    const leaveApplications = await Leave.find(); // Fetch all leave applications from the database
    res.render('all-leaves', { leaveApplications });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.use('/admin',AdminRoutes);
app.use('/employee',Empattendance);
app.use('/employee',employeeRoutes);

// Fetch leave history for a specific employee
app.get('/employee/leave-history/:emp_id', isAuthenticatedEmployee, async (req, res) => {
  const emp_id = req.params.emp_id;
  try {
    const leaveHistory = await Leave.find({ emp_id }); // Fetch leave history for this employee
    res.render('leave-history', { leaveHistory ,emp_id});
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// app.get('/attendance', function (req, res) {
//   res.render('emp-yearly', { type: "emp", req });
// });

app.get('/admin/Attendance', (req, res) => {
  res.render('yearly-calendar',{type:"admin",req}); // Main page with yearly calendar
});

app.get('/month/:year/:month', (req, res) => {
  const { year, month } = req.params;
 
  res.render('monthly-calendar', { year, month });
});

app.get('/attendance/:year/:month/:date', async (req, res) => {
  try {
    let { year, month, date } = req.params;
    const selectedDate = new Date(`${year}-${month}-${date}, 12:00`);
    //console.log(selectedDate)
    // Fetch all employees
    const employees = await Employee.find();

    // Fetch attendance records for the selected date
    const attendanceList = await Attendance.find({ date: selectedDate });
    
    
    // Check if attendance for all employees is already recorded
    if (attendanceList.length === employees.length) {
      //return res.render('attendance-already-recorded');
    }


    res.render('attendance-list', { employees, attendanceList, date: selectedDate });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/attendance/:year/:month/:date', async (req, res) => {
  try {
    const { year, month, date } = req.params;
    const selectedDate = new Date(`${year}-${month}-${date}, 12:00`);
    const attendanceData = req.body.attendance;
    for (const emp_id in attendanceData) {
      const status = attendanceData[emp_id];

      // Check if attendance record already exists for this employee and date
      let attendanceRecord = await Attendance.findOne({ emp_id, date: selectedDate });

      if (attendanceRecord) {
        // Update existing record
        attendanceRecord.status = status;
        await attendanceRecord.save();
      } else {
        // Create a new record
        attendanceRecord = new Attendance({
          emp_id,
          name: (await Employee.findOne({ emp_id })).username, // Fetch employee name
          date: selectedDate,
          status,
        });
        await attendanceRecord.save();
      }
    }
    res.render('attendance-recorded-successfully');
    // res.redirect(`/attendance/${year}/${month}/${date}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.get('/admin/employees/all', isAuthenticatedAdmin, async (req, res) => {
  try {
      const employees = await Employee.find(); // Fetch all employees from the database
      res.render('all-employees', { employees });
  } catch (error) {
      res.status(500).send('Server Error');
  }
});

// Route to generate QR code for each employee
app.get('/employee/:emp_id/qr', async (req, res) => {
  try {
      const emp_id = req.params.emp_id;
      const employee = await Employee.findOne({ emp_id });

      if (!employee) return res.status(404).send("Employee not found");

      const qrCodeUrl = await QRCode.toDataURL(`https://1456-2409-40c0-21-b4d7-2cb0-91fa-81b2-93ef.ngrok-free.app/feedback/${emp_id}`);
      res.render('employee-qr', { employee, qrCodeUrl });
  } catch (error) {
      res.status(500).send("Error generating QR Code");
  }
});

// Route to display feedback form based on employee ID
app.get('/feedback/:emp_id', (req, res) => {
  res.render('feedback-form', { emp_id: req.params.emp_id });
});

// Route to handle feedback form submission
app.post('/feedback', async (req, res) => {
  const { emp_id, customerName, feedbackText, rating } = req.body;

  try {
      const feedback = new Feedback({
          emp_id,
          customerName,
          feedbackText,
          rating
      });
      await feedback.save();
      // res.redirect('/feedback/success');
      res.render('feedback-success')
  } catch (error) {
      res.status(500).send("Error saving feedback");
  }
});

// Success page after feedback submission
app.get('/feedback-success', (req, res) => {
  res.render('feedback-success');
});

// Route to display feedback on admin panel
app.get('/admin/feedback', async (req, res) => {
  try {
      const feedbacks = await Feedback.find().populate('emp_id'); // Populate employee details if needed
      res.render('admin-feedback', { feedbacks });
  } catch (error) {
      res.status(500).send("Error retrieving feedback");
  }
});

// // Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
