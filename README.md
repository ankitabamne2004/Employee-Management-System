💼 Employee Management System

📋 Project Overview
The Employee Management System is a full-stack web application designed to manage and streamline daily operations related to employees in an organization. It offers modules for employee attendance tracking, salary management, leave handling, feedback collection, and admin-to-employee communication. The system features role-based access for admins and employees, providing each with dedicated functionalities.

🛠️ Technologies Used

•	Backend: Node.js, Express.js
•	Frontend: EJS, HTML, CSS
•	Database: MongoDB (NoSQL)
•	Other Tools: Ngrok (used for live feedback scanning via QR code)

✨ Key Features

🔐 Authentication
•	Separate login pages for Admin and Employee
•	Secure credential storage and role-based access


👩‍💼 Admin Panel

•	View all employee records
•	Post/edit/delete notifications
•	Accept or reject leave requests
•	Monitor daily/monthly attendance
•	Calculate and view salaries using Payhead logic
•	Access customer feedback submitted via QR scanner


👨‍💼 Employee Dashboard

•	View personal details and salary
•	Submit leave applications and check leave status
•	View notifications posted by the admin
•	Check monthly attendance calendar


📆 Attendance Management
•	Interactive yearly and monthly calendars
•	Mark and view daily attendance per employee


💰 Salary Management
•	Integrated Payhead system for dynamic salary breakdown
•	Monthly view of salary components and final earnings


📝 Leave Management
•	Leave application form with dynamic fields
•	Track status: Pending / Approved / Rejected


🔔 Notification System
•	Admin posts updates
•	Employees receive updates via a bell icon with alerts


🧾 Feedback Collection (with Ngrok)
•	Feedback form accessible via QR code
•	Ngrok creates a public HTTPS tunnel for real-time access
•	Data is stored securely in the backend for review


📷 Screenshots
Add screenshots of the admin dashboard, employee dashboard, leave form, and feedback form here.


🚀 How to Run the Project
1.	Clone the repository
2.	Install dependencies using npm install
3.	Start the MongoDB server
4.	Run the app using node app.js
5.	Use Ngrok to expose localhost (e.g., ngrok http 3000) for feedback scanner
