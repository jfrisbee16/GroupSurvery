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

app.post('', (req, res, next) => {
    let strEmail = req.body.email.trim().toLowerCase();
    let strPassword = req.body.password;

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

    strPassword = bcrypt.hashSync(strPassword, intSalt);

    // If validations pass
    let strCommand = `INSERT INTO tblUsers VALUES (?, ?, ?)`;
    db.run(strCommand, [strEmail, strPassword, "Active"], function (err) {
        if(err){
            console.log(err)
            res.status(400).json({
                status:"error",
                message:err.message
            })
        } else {
            res.status(201).json({
                status:"success"
            })
        }
    })
})

app.listen(HTTP_PORT,() => {
    console.log('App listening on',HTTP_PORT)
})