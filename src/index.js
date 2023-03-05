require('dotenv').config()
const express = require('express')
const app = require('./router-logic/app.js')
const mongoose = require('mongoose')
const port = process.env.PORT || 3000

// Parse JSON bodies (as sent by API clients)
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// Connect to DATABASE
const DATABASE_URL = process.env.MONGO_URI ||  "mongodb://localhost/subscribers";
mongoose.connect(DATABASE_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection

// Logging any errors
db.on('error', (err) => console.log(err))

// Logging when the connection is successful
db.once('open', () => console.log('connected to database'))

// Start Server
app.listen(port, () => console.log(`App listening on port ${port}!`))
