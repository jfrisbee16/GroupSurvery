const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()

//const dbSource = ''
//const db = new sqlite3.Database(dbSource)
const HTTP_PORT = 8000

var app = express()
app.use(cors())
app.use(express.json())


app.listen(HTTP_PORT,() => {
    console.log('App listening on',HTTP_PORT)
})