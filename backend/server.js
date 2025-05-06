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

app.post('/create-course', (req, res) => {
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

//Delete off course name
app.delete('/delete-course', (req, res) => {
    let strCourseName = req.params.courseName.trim();

    let strCommand = `DELETE FROM tblCourses WHERE CourseName = ?`;
    let arrParams = [strCourseName];
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
                message:console.log("Course deleted successfully")
            })
        }
    })
})

//Update course data
app.put('/update-course', (req, res) => {
    let strCourseName = req.params.courseName.trim();
    let strCourseNumber = req.params.courseNumber;
    let strCourseSection = req.params.courseSection;
    let strCourseTerm = req.params.courseTerm.trim();
    let strCoursStartDate = req.params.courseStartDate.trim();
    let strCourseEndDate = req.params.courseEndDate.trim();

    let strCommand = `UPDATE tblCourses SET CourseNumber = ?, CourseSection = ?, CourseTerm = ?, CourseStartDate = ?, CourseEndDate = ? WHERE CourseName = ?`;
    let arrParams = [strCourseNumber, strCourseSection, strCourseTerm, strCoursStartDate, strCourseEndDate, strCourseName];
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
                message:console.log("Course updated successfully")
            })
        }
    })
})

// Create survey endpoint
app.post('/create-survey', (req, res) => {
    const surveyId = uuid();
    const { title, description, questions, assignedGroups } = req.body;
    const createdBy = req.body.email; // Assuming email is sent in request

    // Start a transaction
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Insert survey
        const surveySql = `INSERT INTO tblSurveys (SurveyID, Title, Description, CreatedBy) VALUES (?, ?, ?, ?)`;
        db.run(surveySql, [surveyId, title, description, createdBy], function(err) {
            if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: err.message });
            }

            // Insert questions
            const questionPromises = questions.map(question => {
                return new Promise((resolve, reject) => {
                    const questionId = uuid();
                    const questionSql = `INSERT INTO tblSurveyQuestions (QuestionID, SurveyID, QuestionText, QuestionType, IsRequired, Options) 
                                       VALUES (?, ?, ?, ?, ?, ?)`;
                    db.run(questionSql, [
                        questionId,
                        surveyId,
                        question.text,
                        question.type,
                        question.required ? 1 : 0,
                        JSON.stringify(question.options || [])
                    ], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });

            // Insert group assignments
            const assignmentPromises = assignedGroups.map(groupId => {
                return new Promise((resolve, reject) => {
                    const assignmentId = uuid();
                    const assignmentSql = `INSERT INTO tblSurveyAssignments (AssignmentID, SurveyID, GroupID) VALUES (?, ?, ?)`;
                    db.run(assignmentSql, [assignmentId, surveyId, groupId], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            });

            // Execute all promises
            Promise.all([...questionPromises, ...assignmentPromises])
                .then(() => {
                    db.run('COMMIT');
                    res.status(200).json({ 
                        status: "success",
                        message: "Survey created successfully",
                        surveyId: surveyId
                    });
                })
                .catch(err => {
                    db.run('ROLLBACK');
                    res.status(500).json({ error: err.message });
                });
        });
    });
});

// Get surveys for a student
app.get('/student-surveys', (req, res) => {
    const studentEmail = req.query.email;

    const sql = `
        SELECT DISTINCT s.*, 
               GROUP_CONCAT(DISTINCT g.GroupName) as AssignedGroups
        FROM tblSurveys s
        JOIN tblSurveyAssignments sa ON s.SurveyID = sa.SurveyID
        JOIN tblGroups g ON sa.GroupID = g.GroupID
        WHERE g.Members LIKE ?
        GROUP BY s.SurveyID
    `;

    db.all(sql, [`%${studentEmail}%`], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ surveys: rows });
    });
});

// Get survey questions
app.get('/survey-questions', (req, res) => {
    const surveyId = req.query.surveyId;

    const sql = `SELECT * FROM tblSurveyQuestions WHERE SurveyID = ?`;
    db.all(sql, [surveyId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ questions: rows });
    });
});

// Submit survey response
app.post('/submit-survey', (req, res) => {
    const { surveyId, responses, respondentEmail, evaluatedMemberEmail } = req.body;

    // Start a transaction
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        const responsePromises = responses.map(response => {
            return new Promise((resolve, reject) => {
                const responseId = uuid();
                const sql = `INSERT INTO tblSurveyResponses 
                           (ResponseID, SurveyID, QuestionID, RespondentEmail, EvaluatedMemberEmail, Response) 
                           VALUES (?, ?, ?, ?, ?, ?)`;
                db.run(sql, [
                    responseId,
                    surveyId,
                    response.questionId,
                    respondentEmail,
                    evaluatedMemberEmail,
                    response.response
                ], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });

        Promise.all(responsePromises)
            .then(() => {
                db.run('COMMIT');
                res.status(200).json({ 
                    status: "success",
                    message: "Survey responses submitted successfully"
                });
            })
            .catch(err => {
                db.run('ROLLBACK');
                res.status(500).json({ error: err.message });
            });
    });
});

// Get survey responses for faculty
app.get('/survey-responses', (req, res) => {
    const surveyId = req.query.surveyId;

    const sql = `
        SELECT sr.*, 
               u1.FirstName as RespondentFirstName, 
               u1.LastName as RespondentLastName,
               u2.FirstName as EvaluatedFirstName, 
               u2.LastName as EvaluatedLastName,
               sq.QuestionText
        FROM tblSurveyResponses sr
        JOIN tblUsers u1 ON sr.RespondentEmail = u1.UserEmail
        JOIN tblUsers u2 ON sr.EvaluatedMemberEmail = u2.UserEmail
        JOIN tblSurveyQuestions sq ON sr.QuestionID = sq.QuestionID
        WHERE sr.SurveyID = ?
        ORDER BY sr.SubmittedAt DESC
    `;

    db.all(sql, [surveyId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ responses: rows });
    });
});

app.listen(HTTP_PORT,() => {
    console.log('App listening on',HTTP_PORT)
})