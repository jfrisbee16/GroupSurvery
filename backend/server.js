const express = require('express')
const cors = require('cors')
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
    let strEmail = req.body.email.trim().toLowerCase();
    let strPassword = req.body.password;
    let strFirstName = req.body.firstName.trim();
    let strLastName = req.body.lastName.trim();
    //let strRole = req.body.role;

    //Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(strEmail)) {
        return res.status(400).json({ error: "You must provide a valid email address" });
    }

    //Password validation
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

    //First Name validation
    if (strFirstName.length < 3) {
        return res.status(400).json({ error: "First name must be at least 3 characters long" });
    }

    //Last Name validation
    if (strLastName.length < 3) {
        return res.status(400).json({ error: "Last name must be at least 3 characters long" });
    }

    strPassword = bcrypt.hashSync(strPassword, intSalt);

    // If validations pass
    let strCommand = `INSERT INTO tblUsers VALUES (?, ?, ?, ?)`;
    db.run(strCommand, [strEmail, strFirstName, strLastName, strPassword], function (err) {
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
})

//Login route
app.post('/user', (req, res) => {
    let strEmail = req.body.email.trim().toLowerCase(); // This would correspond to the request body key
    let strPassword = req.body.password;

    let strCommand = `SELECT EmailPassword FROM tblUsers WHERE UserId = ?`; // Corrected column name

    db.get(strCommand, [strEmail], (err, row) => {
        //Will check if the email exists
        if (!row) {
            return res.status(401).json({ status: "fail", message: "Invalid email or password" });
        }

        //Returns a boolean value of whether the password matches
        const passwordMatch = bcrypt.compareSync(strPassword, row.EmailPassword);
        if (!passwordMatch) {
            return res.status(401).json({ status: "fail", message: "Invalid email or password" });
        }

        return res.status(200).json({ status: "success", message: "Login successful" });
    });
});


app.listen(HTTP_PORT,() => {
    console.log('App listening on',HTTP_PORT)
})