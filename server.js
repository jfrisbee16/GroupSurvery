const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');

const app = express();
const port = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here'; // Use env var in production
const JWT_EXPIRY = '12h';
const SALT_ROUNDS = 10;

// Database setup
const dbSource = path.join(__dirname, 'backend', 'group_survey_project.db');
const db = new sqlite3.Database(dbSource);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

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

// Registration route
app.post('/register', (req, res) => {
    const strUserId = uuid();
    const strFirstName = req.body.firstName.trim();
    const strMiddleName = req.body.middleName.trim();
    const strLastName = req.body.lastName.trim();
    const strEmail = req.body.email.trim().toLowerCase();
    const strRole = req.body.role.trim();
    const strPassword = req.body.password;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(strEmail)) {
        return res.status(400).json({ error: "You must provide a valid email address" });
    }

    // Password validation
    if (strPassword.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }
    if (!/[A-Z]/.test(strPassword)) {
        return res.status(400).json({ error: "Password must contain at least one uppercase letter" });
    }
    if (!/[a-z]/.test(strPassword)) {
        return res.status(400).json({ error: "Password must contain at least one lowercase letter" });
    }
    if (!/[0-9]/.test(strPassword)) {
        return res.status(400).json({ error: "Password must contain at least one number" });
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(strPassword)) {
        return res.status(400).json({ error: "Password must contain at least one special character" });
    }

    // Name validations
    if (strFirstName.length < 3) {
        return res.status(400).json({ error: "First name must be at least 3 characters long" });
    }
    if (strMiddleName.length < 3) {
        return res.status(400).json({ error: "Middle name must be at least 3 characters long" });
    }
    if (strLastName.length < 3) {
        return res.status(400).json({ error: "Last name must be at least 3 characters long" });
    }

    // Role validation
    const validRoles = ['Faculty', 'Student'];
    if (!validRoles.includes(strRole)) {
        return res.status(400).json({ error: "Role must be either 'Student' or 'Faculty'" });
    }

    // Hash password
    bcrypt.hash(strPassword, SALT_ROUNDS, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Error hashing password" });
        }

        const strCommand = `INSERT INTO tblUsers VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const arrParams = [strUserId, strFirstName, strMiddleName, strLastName, strEmail, strRole, hashedPassword];

        db.run(strCommand, arrParams, function(err) {
            if (err) {
                return res.status(400).json({ status: 'error', message: err.message });
            }
            // Issue JWT
            const token = jwt.sign({ email: strEmail }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
            return res.status(200).json({ status: 'success', token });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const strEmail = req.body.email.trim().toLowerCase();
    const strPassword = req.body.password;
    const strCommand = `SELECT EmailPassword, FirstName, LastName FROM tblUsers WHERE UserId = ?`;

    db.get(strCommand, [strEmail], (err, row) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Database error" });
        }

        if (!row) {
            return res.status(401).json({ status: "fail", message: "Invalid email or password" });
        }

        bcrypt.compare(strPassword, row.EmailPassword, (err, passwordMatch) => {
            if (err || !passwordMatch) {
                return res.status(401).json({ status: "fail", message: "Invalid email or password" });
            }

            const token = jwt.sign({ email: strEmail }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
            return res.status(200).json({
                status: "success",
                message: "Login successful",
                token,
                user: {
                    email: strEmail,
                    firstName: row.FirstName,
                    lastName: row.LastName
                }
            });
        });
    });
});

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

// Get student groups route
app.get('/student-groups', authenticateToken, (req, res) => {
    const strEmail = req.user.email;
    
    const strCommand = `
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Handle all other routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 