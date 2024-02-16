# Human Resource Management System (HRMS)

This is a template Human Resource Management System. This system serves as a central repository for all employee-related information, including educational background, recent work experiences, attendance records, leave management, and current project allocations.

This project is developed using Node Express and frontend is implemented with HTML, Bootstrap, CSS, and JavaScript. 


## Key Features:
It consists of following modules:
1. Individual User Accounts: separate accounts for administrators, employees, project manager and account manager.
1. Role-Based Access: Depending on their roles, users have distinct views and access levels to data.
1. Attendance Management: Track and manage the attendance records.
1. Salary Management: Handle the salaries of all employees.
1. Employee Records: Maintain records of each employee's educational background and industrial experience.
1. Project Allocation: Manage the assignment of projects, keeping track of which employees are working on which projects.

## Users:
### 1. Admin:
The administrator has full control over the system, which includes the following capabilities:
- Registering new employees.
- Attendance management.
- Update / Delete employee records
- Allocating and de-allocating projects to employees.

### 2. Employee:
Employees have access to a variety of features, including:
- Mark attendance and view attendance history.
- View their current salary details.
- Accessing employee profile, which includes educational background and work experience.
- Viewing all the projects they are involved.
- Applying for leave.

### 3. Project Manager:
A Project Manager, while also an employee, has additional responsibilities. They have the ability to conduct performance appraisals for team members.

### 4. Accounts Manager:
Accounts Manager is also an employee with the ability to generate pay slip, set bonus, set pay, increment pay, sent email for other employees. 

## How to run the project:

### Pre-requisites
1. Install [node.js](https://nodejs.org/en/download/) in your system.
1. Install [mongoDB](https://www.mongodb.com/try/download/community) in your system. 
1. Run mongoDB server, for GUI interface [MongoDB Compass](https://www.mongodb.com/try/download/compass) can be used.
1. To download the application dependencies, open the terminal, go to the root folder of the application / repository and then type command **npm install**.

### Setup Data
1. For initial list of users, you need to run user-seeder.js file in seed directory of application, in the the terminal, type command **node seed/user-seeder.js**.
1. Dummy username/email address and passwords for each type of user can be found in seed/user-seeder.js file. 

### Run Server
1. To run application server, in the terminal, at the root folder of application,type command **npm start**.
1. Now to use the system, open any browser.
1. In address bar write localhost:3000, where 3000 is the port this application uses.
1. Browser will redirect to the home page of the application.

### Run Tests
1. To run tests, in the terminal, at the root folder of application, type command **npm test**.