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
