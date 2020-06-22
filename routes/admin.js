var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Project = require('../models/project');
var csrf = require('csurf');
var csrfProtection = csrf();
var config_passport = require('../config/passport.js');
var moment = require('moment');
var Leave = require('../models/leave');
var Attendance = require('../models/attendance');


router.use('/', isLoggedIn, function isAuthenticated(req, res, next) {
    next();
});

/**
 * Description:
 * Displays home page to the admin
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */
router.get('/', function viewHome(req, res, next) {
    res.render('Admin/adminHome', {
        title: 'Admin Home',
        csrfToken: req.csrfToken(),
        userName: req.session.user.name
    });
});

/**
 * Description:
 * First it gets attributes of the logged in admin from the User Schema.
 * Attributes are get with the help of id of logged in admin stored in session.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 27th November, 2016
 *
 * Known Bugs: None
 */

router.get('/view-profile', function viewProfile(req, res, next) {

    User.findById(req.session.user._id, function getUser(err, user) {
        if (err) {
            console.log(err);
        }
        res.render('Admin/viewProfile', {
            title: 'Profile',
            csrfToken: req.csrfToken(),
            employee: user,
            moment: moment,
            userName: req.session.user.name
        });
    });

});

/**
 * Description:
 * Sorts the list of employees in User Schema.
 * Such that latest records are shown first.
 * Then displays list of all employees to the admin.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 30th November, 2016
 *
 * Known Bugs: None
 */

router.get('/view-all-employees', function viewAllEmployees(req, res, next) {

    var userChunks = [];
    var chunkSize = 3;
    //find is asynchronous function
    User.find({$or: [{type: 'employee'}, {type: 'project_manager'}, {type: 'accounts_manager'}]}).sort({_id: -1}).exec(function getUsers(err, docs) {
        for (var i = 0; i < docs.length; i++) {
            userChunks.push(docs[i]);
        }
        res.render('Admin/viewAllEmployee', {
            title: 'All Employees',
            csrfToken: req.csrfToken(),
            users: userChunks,
            userName: req.session.user.name
        });
    });


});

/**
 * Description:
 * Displays add employee form to the admin.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */

router.get('/add-employee', function addEmployee(req, res, next) {
    var messages = req.flash('error');
    var newUser = new User();

    res.render('Admin/addEmployee', {
        title: 'Add Employee',
        csrfToken: req.csrfToken(),
        user: config_passport.User,
        messages: messages,
        hasErrors: messages.length > 0,
        userName: req.session.user.name
    });

});

/**
 * Description:
 * First it gets the id of the given employee from the parameters.
 * Finds the project of the employee from Project Schema with the help of that id.
 * Then displays all the projects of the given employee.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 30th November, 2016
 *
 * Known Bugs: None
 */
router.get('/all-employee-projects/:id', function getAllEmployeePojects(req, res, next) {
    var employeeId = req.params.id;
    var projectChunks = [];

    //find is asynchronous function
    Project.find({employeeID: employeeId}).sort({_id: -1}).exec(function findProjectOfEmployee(err, docs) {
        var hasProject = 0;
        if (docs.length > 0) {
            hasProject = 1;
        }
        for (var i = 0; i < docs.length; i++) {
            projectChunks.push(docs[i]);
        }
        User.findById(employeeId, function getUser(err, user) {
            if (err) {
                console.log(err);
            }
            res.render('Admin/employeeAllProjects', {
                title: 'List Of Employee Projects',
                hasProject: hasProject,
                projects: projectChunks,
                csrfToken: req.csrfToken(),
                user: user,
                userName: req.session.user.name
            });
        });

    });
});

/**
 * Description:
 * Displays the list of all the leave applications which are applied by all employees.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */
router.get('/leave-applications', function getLeaveApplications(req, res, next) {

    var leaveChunks = [];
    var employeeChunks = [];
    var temp;
    //find is asynchronous function
    Leave.find({}).sort({_id: -1}).exec(function findAllLeaves(err, docs) {
        var hasLeave = 0;
        if (docs.length > 0) {
            hasLeave = 1;
        }
        for (var i = 0; i < docs.length; i++) {
            leaveChunks.push(docs[i])
        }
        for (var i = 0; i < leaveChunks.length; i++) {

            User.findById(leaveChunks[i].applicantID, function getUser(err, user) {
                if (err) {
                    console.log(err);
                }
                employeeChunks.push(user);

            })
        }

        // call the rest of the code and have it execute after 3 seconds
        setTimeout(render_view, 900);
        function render_view() {
            res.render('Admin/allApplications', {
                title: 'List Of Leave Applications',
                csrfToken: req.csrfToken(),
                hasLeave: hasLeave,
                leaves: leaveChunks,
                employees: employeeChunks, moment: moment, userName: req.session.user.name
            });
        }
    });

});

/**
 * Description:
 * Gets the leave id and employee id from the parameters.
 * Then shows the response application form of that leave of the employee to the admin.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 30th November, 2016
 *
 * Known Bugs: None
 */
router.get('/respond-application/:leave_id/:employee_id', function respondApplication(req, res, next) {
    var leaveID = req.params.leave_id;
    var employeeID = req.params.employee_id;
    Leave.findById(leaveID, function getLeave(err, leave) {

        if (err) {
            console.log(err);
        }
        User.findById(employeeID, function getUser(err, user) {
            if (err) {
                console.log(err);
            }
            res.render('Admin/applicationResponse', {
                title: 'Respond Leave Application',
                csrfToken: req.csrfToken(),
                leave: leave,
                employee: user,
                moment: moment, userName: req.session.user.name
            });


        })


    });


});


/**
 * Description:
 * Displays profile of the employee with the help of the id of the employee from the parameters.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */
router.get('/employee-profile/:id', function getEmployeeProfile(req, res, next) {
    var employeeId = req.params.id;
    User.findById(employeeId, function getUser(err, user) {
        if (err) {
            console.log(err);
        }
        res.render('Admin/employeeProfile', {
            title: 'Employee Profile',
            employee: user,
            csrfToken: req.csrfToken(),
            moment: moment,
            userName: req.session.user.name
        });

    });
});

/**
 * Description:
 * Displays edit employee form to the admin.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */
router.get('/edit-employee/:id', function editEmployee(req, res, next) {
    var employeeId = req.params.id;
    User.findById(employeeId, function getUser(err, user) {
        if (err) {
            res.redirect('/admin/');
        }
        res.render('Admin/editEmployee', {
            title: 'Edit Employee',
            csrfToken: req.csrfToken(),
            employee: user,
            moment: moment,
            message: '',
            userName: req.session.user.name
        });


    });

});

/**
 * Description:
 * Gets id of the projet to be edit.
 * Displays the form of the edit project to th admin.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 30th November, 2016
 *
 * Known Bugs: None
 */
router.get('/edit-employee-project/:id', function editEmployeeProject(req, res, next) {
    var projectId = req.params.id;
    Project.findById(projectId, function getProject(err, project) {
        if (err) {
            console.log(err);
        }
        res.render('Admin/editProject', {
            title: 'Edit Employee',
            csrfToken: req.csrfToken(),
            project: project,
            moment: moment,
            message: '',
            userName: req.session.user.name
        });


    });

});

/**
 * Description:
 * Gets the id of the employee from parameters.
 * Displays the add employee project form to the admin.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */
router.get('/add-employee-project/:id', function addEmployeeProject(req, res, next) {

    var employeeId = req.params.id;
    User.findById(employeeId, function getUser(err, user) {
        if (err) {
            res.redirect('/admin/');
        }
        res.render('Admin/addProject', {
            title: 'Add Employee Project',
            csrfToken: req.csrfToken(),
            employee: user,
            moment: moment,
            message: '',
            userName: req.session.user.name
        });

    });

});


/**
 * Description:
 * First finds project in the Project Schema with the help of id from the parameters.
 * Gets the Employee of the project.
 * Displays the project of the employee.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */
router.get('/employee-project-info/:id', function viewEmployeeProjectInfo(req, res, next) {
    var projectId = req.params.id;
    Project.findById(projectId, function getProject(err, project) {
        if (err) {
            console.log(err);
        }
        User.findById(project.employeeID, function getUser(err, user) {
            if (err) {
                console.log(err);
            }
            res.render('Admin/projectInfo', {
                title: 'Employee Project Information',
                project: project,
                employee: user,
                moment: moment,
                message: '',
                userName: req.session.user.name,
                csrfToken: req.csrfToken()
            });
        })

    });

});

/**
 * Description:
 * Redirects admin to the employee profile page.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */
router.get('/redirect-employee-profile', function viewEmployeeProfile(req, res, next) {
    var employeeId = req.user.id;
    User.findById(employeeId, function getUser(err, user) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/employee-profile/' + employeeId);

    });

});

/**
 * Description:
 * Displays the admin its own attendance sheet
 *
 * Author: Salman Nizam
 *
 * Last Updated: 30th November, 2016
 *
 * Known Bugs: None
 */
router.post('/view-attendance', function viewAttendance(req, res, next) {
    var attendanceChunks = [];
    Attendance.find({
        employeeID: req.session.user._id,
        month: req.body.month,
        year: req.body.year
    }).sort({_id: -1}).exec(function viewAttendanceSheet(err, docs) {
        var found = 0;
        if (docs.length > 0) {
            found = 1;
        }
        for (var i = 0; i < docs.length; i++) {
            attendanceChunks.push(docs[i]);
        }
        res.render('Admin/viewAttendanceSheet', {
            title: 'Attendance Sheet',
            month: req.body.month,
            csrfToken: req.csrfToken(),
            found: found,
            attendance: attendanceChunks,
            userName: req.session.user.name,
            moment: moment
        });
    });


});

/**
 * Description:
 * After marking attendance.
 * Shows current attendance to the admin.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */
router.get('/view-attendance-current', function viewCurrentlyMarkedAttendance(req, res, next) {
    var attendanceChunks = [];

    Attendance.find({
        employeeID: req.session.user._id,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    }).sort({_id: -1}).exec(function getAttendanceSheet(err, docs) {
        var found = 0;
        if (docs.length > 0) {
            found = 1;
        }
        for (var i = 0; i < docs.length; i++) {
            attendanceChunks.push(docs[i]);
        }
        res.render('Admin/viewAttendanceSheet', {
            title: 'Attendance Sheet',
            month: new Date().getMonth() + 1,
            csrfToken: req.csrfToken(),
            found: found,
            attendance: attendanceChunks,
            moment: moment,
            userName: req.session.user.name
        });
    });

});

/**
 * Description:
 * Displays the attendance sheet of the given employee to the admin.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */
router.get('/view-employee-attendance/:id', function viewEmployeeAttendance(req, res, next) {
    var attendanceChunks = [];
    Attendance.find({employeeID: req.params.id}).sort({_id: -1}).exec(function getAttendanceSheet(err, docs) {
        var found = 0;
        if (docs.length > 0) {
            found = 1;
        }
        for (var i = 0; i < docs.length; i++) {
            attendanceChunks.push(docs[i]);
        }

        User.findById(req.params.id, function getUser(err, user) {

            res.render('Admin/employeeAttendanceSheet', {
                title: 'Employee Attendance Sheet',
                month: req.body.month,
                csrfToken: req.csrfToken(),
                found: found,
                attendance: attendanceChunks,
                moment: moment,
                userName: req.session.user.name
                ,
                'employee_name': user.name

            })
        });
    });


});

/**
 * Description:
 * Adds employee to the User Schema by getting attributes from the body of the post request.
 * Then redirects admin to the profile information page of the added employee.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 30th November, 2016
 *
 * Known Bugs: None
 */
router.post('/add-employee', passport.authenticate('local.add-employee', {
    successRedirect: '/admin/redirect-employee-profile',
    failureRedirect: '/admin/add-employee',
    failureFlash: true,
}));

/**
 * Description:
 * Gets the id of the leave from the body of the post request.
 * Sets the response field of that leave according to response given by employee from body of the post request.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */
router.post('/respond-application', function respondApplication(req, res) {

    Leave.findById(req.body.leave_id, function getLeave(err, leave) {
        leave.adminResponse = req.body.status;
        leave.save(function saveLeave(err) {
            if (err) {
                console.log(err);
            }
            res.redirect('/admin/leave-applications');
        })
    })


});

/**
 * Description:
 * Gets the id of the employee from the parameters.
 * Gets the edited fields of the project from body of the post request.
 * Saves the update field to the project of the employee  in Project Schema.
 * Edits the project of the employee.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */

router.post('/edit-employee/:id', function editEmployee(req, res) {
    var employeeId = req.params.id;
    var newUser = new User();
    newUser.email = req.body.email;
    if (req.body.designation == "Accounts Manager") {
        newUser.type = "accounts_manager";
    }
    else if (req.body.designation == "Project Manager") {
        newUser.type = "project_manager";
    }
    else {
        newUser.type = "employee";
    }
    newUser.name = req.body.name,
        newUser.dateOfBirth = new Date(req.body.DOB),
        newUser.contactNumber = req.body.number,
        newUser.department = req.body.department;
    newUser.Skills = req.body['skills[]'];
    newUser.designation = req.body.designation;

    User.findById(employeeId, function getUser(err, user) {
        if (err) {
            res.redirect('/admin/');
        }
        if (user.email != req.body.email) {
            User.findOne({'email': req.body.email}, function getUser(err, user) {
                if (err) {
                    res.redirect('/admin/');
                }
                if (user) {
                    res.render('Admin/editEmployee', {
                        title: 'Edit Employee',
                        csrfToken: req.csrfToken(),
                        employee: newUser,
                        moment: moment,
                        message: 'Email is already in use', userName: req.session.user.name
                    });

                }
            });
        }
        user.email = req.body.email;
        if (req.body.designation == "Accounts Manager") {
            user.type = "accounts_manager";
        }
        else if (req.body.designation == "Project Manager") {
            user.type = "project_manager";
        }
        else {
            user.type = "employee";
        }
        user.name = req.body.name,
            user.dateOfBirth = new Date(req.body.DOB),
            user.contactNumber = req.body.number,
            user.department = req.body.department;
        user.Skills = req.body['skills[]'];
        user.designation = req.body.designation;

        user.save(function saveUser(err) {
            if (err) {
                console.log(error);
            }
            res.redirect('/admin/employee-profile/' + employeeId);

        });
    });

});

/**
 * Description:
 * Gets the id of the employee from the parameters.
 * Gets the attributed of the the project from body of the post request.
 * Adds the the project of the employee in Project Schema.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 29th November, 2016
 *
 * Known Bugs: None
 */
router.post('/add-employee-project/:id', function addEmployeeProject(req, res) {
    var newProject = new Project();
    newProject.employeeID = req.params.id;
    newProject.title = req.body.title;
    newProject.type = req.body.type;
    newProject.startDate = new Date(req.body.start_date),
        newProject.endDate = new Date(req.body.end_date),
        newProject.description = req.body.description,
        newProject.status = req.body.status;

    newProject.save(function saveProject(err) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/employee-project-info/' + newProject._id);


    });

});

/**
 * Description:
 * Gets the id of the employee from the parameters.
 * Gets the edited fields of the project from body of the post request.
 * Saves the update field to the project of the employee  in Project Schema.
 * Edits the project of the employee.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 30th November, 2016
 *
 * Known Bugs: None
 */

router.post('/edit-employee-project/:id', function editEmployeeProject(req, res) {
    var projectId = req.params.id;
    var newProject = new Project();

    Project.findById(projectId, function (err, project) {
        if (err) {
            console.log(err);
        }
        project.title = req.body.title;
        project.type = req.body.type;
        project.startDate = new Date(req.body.start_date),
            project.endDate = new Date(req.body.end_date),
            project.description = req.body.description,
            project.status = req.body.status;

        project.save(function saveProject(err) {
            if (err) {
                console.log(err);
            }
            res.redirect('/admin/employee-project-info/' + projectId);

        });
    });

});

/**
 * Description:
 * Gets the id of the employeed to be deleted form the parameters.
 * Find the given employee from User Scheme.
 * Deleteth employee from User Schema.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 30th November, 2016
 *
 * Known Bugs: None
 */

router.post('/delete-employee/:id', function deleteEmployee(req, res) {
    var id = req.params.id;
    User.findByIdAndRemove({_id: id}, function deleteUser(err) {
        if (err) {
            console.log('unable to delete employee');
        }
        else {
            res.redirect('/admin/view-all-employees');
        }
    });
});



/**
 * Description:
 * Gets id of the current logged in user from the session.
 * Gets current date.
 * Marks the attendance of that user in Attendance Schema.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 28th November, 2016
 *
 * Known Bugs: None
 */

router.post('/mark-attendance', function markAttendance(req, res, next) {

    Attendance.find({
        employeeID: req.session.user._id,
        date: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    }, function getAttendance(err, docs) {
        var found = 0;
        if (docs.length > 0) {
            found = 1;
        }
        else {

            var newAttendance = new Attendance();
            newAttendance.employeeID = req.session.user._id;
            newAttendance.year = new Date().getFullYear();
            newAttendance.month = new Date().getMonth() + 1;
            newAttendance.date = new Date().getDate();
            newAttendance.present = 1;
            newAttendance.save(function saveAttendance(err) {
                if (err) {
                    console.log(err);
                }

            });
        }
        res.redirect('/admin/view-attendance-current');

    });

});
module.exports = router;

/**
 * Description:
 * Checks if user is logged in then redirects user to the his/her home page.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 28th November, 2016
 *
 * Known Bugs: None
 */

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

/**
 * Description:
 * Checks if user is not logged in then redirects user to the login page.
 *
 * Author: Salman Nizam
 *
 * Last Updated: 28th November, 2016
 *
 * Known Bugs: None
 */
function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}