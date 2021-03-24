## Abstract:
It is a web application which is a human resource management system. It keeps the information about the human resource, educational background of all employees, their  recent experiences, their attendance, their  leaves management and their current allocated projects. Administration panel will be created to manage all the information of hired employees. It will contain the statistics about the employee hiring ratio from different institutions and the average turnover of employees from different institutions. This project is built on Node Express which is is a web application framework for Node.js and the front end is created using HTML, Bootstrap, CSS and JS.  

## Product Features:
The product consists of the basic modules, which are listed as follows
1. Separate user accounts for all the admins and employees.
1. Distinct views of data and distinct data access to the members, based on their privileges.
1. Employee/Admin registration.
1. Managing attendance of all the employees.
1. Managing salaries of all the employees.
1. Keeping an employee’s educational and industrial experience record.
1. Managing the current allocated projects to the employees, within the organization.

## Users:
 ### 1. Admin:
He/She have complete access of the system which includes registration of employees; decide privileges for other employees, viewing       and modifying attendance of the present day, viewing and modifying employee salary, delete record or profile of employee, allocation     and de-allocation of project to an employee, approve/disapprove leave application of an employee.
 ### 2. Employee:
He/She will be able to mark his/her attendance, view his/her attendance history, to view his/her current salary,  view his/her current employee profile (including educational and industrial history), view all his/her projects within organization, view other         employees who are sharing the same project with him, apply for leave and view status of leave applications.
 ### 3. Project Manager:
He/She will be able to view skills of employees, provide performance appraisal to employee.
 ### 4. Accounts Manager:
He/She will be able to generate pay slip for each employee, set bonus for employee, set pay of employee, increment pay of employee, sent email pay slip to each employee. 

## How to run the project:
1. Clone or download this repository in the folder.
1. Install [node.js](https://nodejs.org/en/download/) in your system.
1. Install [mongoDB](https://www.mongodb.com/) in your system. 
1. Run mongoDB server by running the mongod application file in the installed mongoDB driectory.
1. To start the application dependencies, open the terminal, go to the root folder of the application / repository and then type command **npm install**.
1. To run application server, in the terminal, at the root folder of application,type command **npm start**.
1. If you are running application for the first time then you need some dummy users entered into mongoDB for logging-in. For this purpose, you need to run user-seeder.js file in seed directory of application, in the in the terminal, go to the seed folder of application, type command **node user-seeder.js**.
1. Dummy username/email address and passwords for each type of user can also be seen in user-seeder.js file. 
1. Now to use the system, open any browser.
1. In address bar write localhost:3000, where 3000 is the port this application uses.
1. Browser will redirect to the home page of the application.
