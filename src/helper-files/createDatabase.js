require('dotenv').config()
const mongoose = require('mongoose')
const subscriberModel = require('../models/subscribers')
const data = require('./data')

// Connect to DATABASE
const DATABASE_URL = process.env.MONGO_URI || "mongodb://localhost:27017/subscribers"

mongoose.connect(DATABASE_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => console.log('Database created...'))

// defining a function to fill database with data 
const refreshAll = async () => {
    await subscriberModel.deleteMany({})
    await subscriberModel.insertMany(data)
    await mongoose.disconnect();
}
refreshAll()