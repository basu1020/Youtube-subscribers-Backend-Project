# Youtube-subscribers-Backend-Project
Hello All, this is Youtube Subscribers Backend project where I have created an API using `Express.js` and `MongoDB`. 
It has three endpoints which gives info about the subscribers and their subscribed channel. 

## Overview of the root directory 
Root directory has few folders and files which has our code logic. 
- `__tests__` - it has two test files `router.test.js` and `schema.test.js` testing the server and schema created with the help of `mongoose`. 
- `mochawesome-report` - It has mochawesome reports created while testing. 
- `src` - It is the main folder where server logic is written. 
- `package.json` and `package-lock.json` - files with info about dependency used in this project. 

## Structure and contents of **src** folder. 

![YoutubeSRCoverview](https://user-images.githubusercontent.com/106004070/222953073-3be04fe6-5a1e-4bb4-b760-5be24f7b5eed.png)  

`src` folder has three folders and `index.js` file 

Folder structure - 
- helper-files - It has two files `createDatabase.js` and `data.js`.
  - `data.js` - It has subscribers details - names and subscribed channel
  
      ```javascript
        const data = [
        {
          "name": "Jeread Krus",
          "subscribedChannel": "CNET"
        },
        {
          "name": "John Doe",
          "subscribedChannel": "freeCodeCamp.org"
        },
        {
          "name": "Lucifer",
          "subscribedChannel": "Sentex"
        }
      ]

      module.exports = data;
     ```
     
  - `createDatabase` contains logic for creating database with the info in data.js file 
  
    ```javascript
    const mongoose = require('mongoose')
    const subscriberModel = require('../models/subscribers')
    const data = require('./data')

    // Connect to DATABASE
    const DATABASE_URL = "mongodb://localhost:27017/subscribers";
    mongoose.connect(DATABASE_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection
    db.on('error', (err) => console.log(err))
    db.once('open', () => console.log('Database created...'))

    const refreshAll = async () => {
        await subscriberModel.deleteMany({})
        // console.log(connection)
        await subscriberModel.insertMany(data)
        await mongoose.disconnect();
    }
    refreshAll()
    ```
    
- models - This folder has `subscribers.js` which has logic for Subscribers schema. 

    ```javascript
    const mongoose = require('mongoose');

    const susbcriberSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        subscribedChannel:{
            type: String,
            required: true,
        },
        subscribedDate: {
            type: Date,
            required: true,
            default: Date.now
        }
    })

    module.exports = mongoose.model('Subscriber',susbcriberSchema);
    ```
    
- router-logic - It has `app.js` containing router logic 

  ```javascript
    const express = require('express');
    const { check, validationResult } = require('express-validator');

    // Create a new instance of the app
    const app = express()

    // Import Subscribers model
    const Subscribers = require('../models/subscribers')

    // Defining root route
    app.get('/', (req, res) => {
        try {
            res.status(200).json({
                welcome: 'This is an API created for Youtube Subscribers Backend Project',
                endpoints: {
                    toGetAllSubsribers: '/subscribers',
                    toGetAllSubsribersNames: '/subscribers/names',
                    toGetSubscribersByID: '/subscribers/:id'
                }
            })
        } catch (err) {
            res.status(500).send({
                error: err.message
            })
        }

    })

    // Defining route to get all subscribers
    app.get('/subscribers', async (req, res) => {
        try {
            const subscribers = await Subscribers.find()
            res.status(200).send({
                subscribers: subscribers
            })
        } catch (err) {
            res.status(500).send({
                error: err.message
            })
        }

    })

    // Defining route to get subscribers by name and subscribed channel
    app.get('/subscribers/names', async (req, res) => {
        try {
            const subscribers = await Subscribers.find({}, {
                name: 1,
                subscribedChannel: 1,
                _id: 0
            });
            res.status(200).send({
                subscribers: subscribers
            });
        } catch (err) {
            res.status(500).send({
                error: err.message
            });
        }
    });

    // Defining route to get subscriber by ID
    // I have defined a middleware to check whether the given ID is a valid MongoDB hexadecimal or not. 
    app.get('/subscribers/:id', [
        check('id').isLength({ min: 24, max: 24 }).isHexadecimal()
    ],
        async (req, res) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).send({ message: 'Invalid subscriber ID.' });
            }

            const id = req.params.id
            try {
                const subscriber = await Subscribers.findById(id).exec();

                // findById(id) returns 'null' if ID was a valid hexadecimal but is not present in the collection, that's why if subscriber comes out to be null I am sending 'Subscriber not found.' message.

                if (!subscriber) {
                    return res.status(400).send({ message: 'Subscriber not found.' });
                }

                // sending subscriber if ID was found in collection. 
                res.status(200).send(subscriber);

            } catch (err) {
                res.status(400).send({
                    message: err.message
                })
            }
        })

    // Export app
    module.exports = app;

    ```
