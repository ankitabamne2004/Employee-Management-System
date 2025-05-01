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

Admin Dadboard

![image](https://github.com/user-attachments/assets/11c440d2-8e71-43a5-8922-a2f21248ac2e)



Admin Notification Panel

![image](https://github.com/user-attachments/assets/dea83329-37ff-46b9-b0de-1465e755daa7)
![image](https://github.com/user-attachments/assets/a57d70b4-6559-4d17-8cc5-d5a11e573d56)



Admin leave application

![image](https://github.com/user-attachments/assets/36eaaf57-ba9b-4530-bd18-a1981ba4a21a)



Admin Attendance UI

![image](https://github.com/user-attachments/assets/3e4a7b36-8316-4c4d-9817-4dc815e4b788)
![image](https://github.com/user-attachments/assets/17160134-1b62-49db-8284-d008a74c8352)
![image](https://github.com/user-attachments/assets/83754e11-f147-49d5-88ca-d91bb1a00a5f)
![image](https://github.com/user-attachments/assets/c24cf842-e818-4cae-a1b0-0965c98a2afa)


Admin Payroll UI

![image](https://github.com/user-attachments/assets/01444674-655a-482d-a30c-456e0a8b0f54)
![image](https://github.com/user-attachments/assets/a416e4ed-d816-4ff2-9ae3-18f5c1f9e71e)
![image](https://github.com/user-attachments/assets/1ea20e7a-be4f-42b1-af5f-1f2b0eb2e786)



Admin Feedback UI

![image](https://github.com/user-attachments/assets/16cf7184-0bb4-401c-8365-9999bd2c2ca4)





Employee UI 

![image](https://github.com/user-attachments/assets/eb4979cf-401a-4ea6-9291-c489efdbd1e5)



Employee Leave History UI

![image](https://github.com/user-attachments/assets/673e0a3b-b47c-4362-94e7-930a0630a799)


Employee Apply Leave UI

![image](https://github.com/user-attachments/assets/9a0698d5-25bc-4bc8-b6e8-631449477be9)


Employee Feedback UI

![image](https://github.com/user-attachments/assets/a2351527-b297-499c-ba50-8d289dab6109)



🚀 How to Run the Project
1.	Clone the repository
2.	Install dependencies using npm install
3.	Start the MongoDB server
4.	Run the app using node app.js
5.	Use Ngrok to expose localhost (e.g., ngrok http 3000) for feedback scanner
