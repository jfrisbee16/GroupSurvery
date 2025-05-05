const express = require('express')
const cors = require('cors')
const uuid = require('uuid').v4
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const intSalt = 10
const path = require('path');

const dbSource = 'group_survey_project.db'
const db = new sqlite3.Database(dbSource)
const HTTP_PORT = 8000
const JWT_SECRET = 'your_secret_key_here'; // Use env var in production
const JWT_EXPIRY = '12h';

var app = express()
app.use(cors())
app.use(express.json())

//Need a role and change user id to email in the database

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

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
  
    //strPassword = bcrypt.hashSync(strPassword, intSalt);
  
    // If validations pass
    if(blnError == true){
        return res.status(400).json({ error: "Validation failed" });
    } else {
    req.body.userId = strUserId;
    //let strCommand = `INSERT INTO tblUsers VALUES ('${strUserId}', '${strFirstName}', '${strMiddleName}', '${strLastName}', '${strEmail}', '${strRole}', '${strPassword}')`;
  
    let strCommand = `INSERT INTO tblUsers VALUES (?, ?, ?, ?, ?, ?, ?)`;
    let arrParams = [strUserId, strFirstName, strMiddleName, strLastName, strEmail, strRole, strPassword];
    console.log(strCommand)
    db.run(strCommand, arrParams, function (err) {
        if(err){
            return res.status(400).json({ status: 'error', message: err.message });
        } else {
            // Issue JWT
            const token = jwt.sign({ email: strEmail }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
            return res.status(200).json({ status: 'success', token });
        }
    })
    }
  })
  

//Login route
app.post('/login', (req, res) => {
    let strEmail = req.body.email.trim().toLowerCase();
    let strPassword = req.body.password;
<<<<<<< HEAD

    let strCommand = `SELECT EmailPassword, FirstName, LastName FROM tblUsers WHERE UserId = ?`;
=======
    let strCommand = `SELECT EmailPassword, FirstName, LastName FROM tblUsers WHERE UserId = ?`; // Corrected column name
>>>>>>> backend

    db.get(strCommand, [strEmail], (err, row) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Database error" });
        }

        //Will check if the email exists
        if (!row) {
            return res.status(401).json({ status: "fail", message: "Invalid email or password" });
        }

        //Returns a boolean value of whether the password matches
        const passwordMatch = bcrypt.compareSync(strPassword, row.EmailPassword);
        if (!passwordMatch) {
            return res.status(401).json({ status: "fail", message: "Invalid email or password" });
        }
<<<<<<< HEAD

        return res.status(200).json({ 
            status: "success", 
            message: "Login successful",
            user: {
                email: strEmail,
                firstName: row.FirstName,
                lastName: row.LastName
            }
        });
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
=======
        // Issue JWT
        const token = jwt.sign({ email: strEmail }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        return res.status(200).json({ status: "success", message: "Login successful", token });
    });
});

// JWT middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Profile endpoint (protected)
app.get('/profile', authenticateToken, (req, res) => {
    const strEmail = req.user.email;
    db.get('SELECT UserId as email, FirstName, LastName FROM tblUsers WHERE UserId = ?', [strEmail], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
    });
});

// --- In-memory for demo; replace with DB logic in production ---
let surveys = [];
let groups = [];

// Create Survey (protected)
app.post('/survey', authenticateToken, (req, res) => {
    const { title, questions } = req.body;
    if (!title || !questions || !Array.isArray(questions)) {
        return res.status(400).json({ error: 'Title and questions are required.' });
    }
    const survey = { id: Date.now(), title, questions, createdBy: req.user.email, createdAt: new Date() };
    surveys.push(survey);
    res.status(201).json(survey);
});

// List Surveys (protected)
app.get('/surveys', authenticateToken, (req, res) => {
    res.json(surveys);
});

// Create Group (protected)
app.post('/group', authenticateToken, (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Group name required.' });
    const group = { id: Date.now(), name, createdBy: req.user.email, createdAt: new Date() };
    groups.push(group);
    res.status(201).json(group);
});

// List Groups (protected)
app.get('/groups', authenticateToken, (req, res) => {
    res.json(groups);
});

// Serve index.html for all other routes (SPA support)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
>>>>>>> backend

app.listen(HTTP_PORT,() => {
    console.log('App listening on',HTTP_PORT)
})
