const express = require('express');
const app = express()
const Subscribers = require('../models/subscribers')

// Your code goes here

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

app.get('/subscribers/:id', async (req, res) => {
    const id = req.params.id
    try {
        const subscriber = await Subscribers.findById(id).exec();
        res.status(200).send(subscriber)
    } catch (err) {
        if (err.name === 'CastError') {
            res.status(400).send({ message: `Subscriber not found for id ${id}` });
        } else {
            res.status(500).send({
                error: err.message
            });
        }
    }
})

module.exports = app;
