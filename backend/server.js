const express = require('express')
const cors = require('cors')
const uuid = require('uuid').v4
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')
const intSalt = 10

const dbSource = 'group_survey_project.db'
const db = new sqlite3.Database(dbSource)
const HTTP_PORT = 8000

var app = express()
app.use(cors())
app.use(express.json())

//Need a role and change user id to email in the database

//Registration route
app.post('/register', (req, res, next) => {
    let strUserId = uuid();
    let strFirstName = req.body.firstName.trim();
    let strMiddleName = req.body.middleName.trim();
    let strLastName = req.body.lastName.trim();
    let strEmail = req.body.email.trim().toLowerCase();
    let strRole = req.body.role.trim();
    let strPassword = req.body.password;
  
    //Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(strEmail)) {
        return res.status(400).json({ error: "You must provide a valid email address" });
    }
  
    let blnError = false;
  
    //Password validation
    if (strPassword.length < 8) {
        blnError = true;
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }
    if (!/[A-Z]/.test(strPassword)) {
        blnError = true;
        return res.status(400).json({ error: "Password must contain at least one uppercase letter" });
    }
    if (!/[a-z]/.test(strPassword)) {
        blnError = true;
        return res.status(400).json({ error: "Password must contain at least one lowercase letter" });
    }
    if (!/[0-9]/.test(strPassword)) {
        blnError = true;
        return res.status(400).json({ error: "Password must contain at least one number" });
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(strPassword)) {
        blnError = true;
        return res.status(400).json({ error: "Password must contain at least one special character" });
    }
  
    //First Name validation
    if (strFirstName.length < 3) {
        blnError = true;
        return res.status(400).json({ error: "First name must be at least 3 characters long" });
    }
  
    //Middle Name validation
    if (strMiddleName.length < 3) {
        blnError = true;  
        return res.status(400).json({ error: "Middle name must be at least 3 characters long" });
    }

    //Last Name validation
    if (strLastName.length < 3) {
        blnError = true;  
        return res.status(400).json({ error: "Last name must be at least 3 characters long" });
    }
  
    //Role validation
    const validRoles = ['Faculty', 'Student'];
    if (!validRoles.includes(strRole)) {
        blnError = true;
        return res.status(400).json({ error: "Role must be either 'Student' or 'Faculty'" });
    }
  
    // If validations pass
    if(blnError == true){
        return res.status(400).json({ error: "Validation failed" });
    } else {
    
    req.body.userId = strUserId;
    strPassword = bcrypt.hashSync(strPassword, intSalt);
  
    let strCommand = `INSERT INTO tblUsers VALUES (?, ?, ?, ?, ?, ?, ?)`;
    let arrParams = [strUserId, strFirstName, strMiddleName, strLastName, strEmail, strRole, strPassword];
    console.log(strCommand)
    db.run(strCommand, arrParams, function (err) {
        if(err){
            console.log(err)
            res.status(400).json({
                status:"error",
                message:err.message
            })
        } else {
            res.status(200).json({
                status:"success"
            })
        }
    })
    }
  })
  

//Login route
app.post('/login', (req, res) => {
    let strEmail = req.body.email.trim().toLowerCase();
    let strPassword = req.body.password;

    let strCommand = `SELECT UserPassword, FirstName, MiddleName, LastName, UserRole, UserID FROM tblUsers WHERE UserEmail = ?`;

    db.get(strCommand, [strEmail], (err, row) => {
        if (err) {
            return res.status(500).json({ status: "error", message:err.message });
        }

        //Will check if the email exists
        if (!row) {
            return res.status(401).json({ status: "fail", message: "Invalid email" });
        }

        //Returns a boolean value of whether the password matches
        const passwordMatch = bcrypt.compareSync(strPassword, row.UserPassword);
        
        if (!passwordMatch) {
            return res.status(401).json({ status: "fail", message: "Invalid email or password" });
        }
        else{
            return res.status(200).json({ 
                status: "success", 
                message: "Login successful",
                user: row
            });
        }
    });
});

// Get student groups route
app.get('/student-groups', (req, res) => {
    const strEmail = req.query.email;
    
    if (!strEmail) {
        return res.status(400).json({ error: "Email is required" });
    }

    let strCommand = `
        SELECT g.GroupName, g.Members 
        FROM tblGroups g
        WHERE g.Members LIKE ?
    `;

    db.all(strCommand, [`%${strEmail}%`], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        const groups = rows.map(row => ({
            name: row.GroupName,
            members: row.Members.split(',').map(member => member.trim())
        }));

        res.json({ groups });
    });
});

pp.post('/create-course', (req, res) => {
    let strCourseId = uuid();
    let strCourseName = req.body.courseName.trim();
    let strCourseNumber = req.body.courseNumber;
    let strCourseSection = req.body.courseSection;
    let strCourseTerm = req.body.courseTerm.trim();
    let strCoursStartDate = req.body.courseStartDate.trim();
    let strCourseEndDate = req.body.courseEndDate.trim();


    let strCommand = `INSERT INTO tblCourses VALUES (?, ?, ?, ?, ?, ?, ?)`;
    let arrParams = [strCourseId, strCourseName, strCourseNumber, strCourseSection, strCourseTerm, strCoursStartDate, strCourseEndDate];
    console.log(strCommand)

    db.run(strCommand, arrParams, function (err) {
        if(err){
            console.log(err)
            res.status(400).json({
                status:"error",
                message:err.message
            })
        } else {
            res.status(200).json({
                status:"success",
                message:console.log("Course created successfully")
            })
        }
    })
})

// View all courses route
app.get('/view-courses', (req, res) => {
    let strCommand = `SELECT * FROM tblCourses`;

    db.all(strCommand, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        else{
            console.log(rows)
            //res.json({ courses: rows });
            res.status(200).json({
                status:"success",
                message:rows,
                courses:rows
            })
        }

        
    });
});

app.listen(HTTP_PORT,() => {
    console.log('App listening on',HTTP_PORT)
})