# Youtube-subscribers-Backend-Project
Hello All, this is Youtube Subscribers Backend project where I have created an API using `Express.js` and `MongoDB`. 
It has three endpoints which gives info about the subscribers and their subscribed channel. 

![YoutubeSample](https://user-images.githubusercontent.com/106004070/224384848-8359bf07-d02c-4e60-a2f3-93b25717038e.png)

link - https://smiling-dirndl-yak.cyclic.app/


## Overview of the root directory 
Root directory has few folders and files which has our code logic. 
- `__tests__` - it has two test files `router.test.js` and `schema.test.js` testing the server and schema created with the help of `mongoose`. 
- `mochawesome-report` - It has mochawesome reports created while testing. 
- `src` - It is the main folder where server logic is written. 
- `package.json` and `package-lock.json` - files with info about dependencies used in this project. 

## API and Schema Details

### API Details

- This is a Node.js server using the Express framework to build a RESTful API for a YouTube subscribers.
- The API has three routes, which are accessed using HTTP GET requests.
- The root route ('/') returns a JSON response containing information about the API and the available endpoints.

  ```javascript
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
  ```
  
- The `/subscribers` route returns a JSON response containing an array of all the subscribers in the system.
  
  
  ```javascript
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

  ```
  
- The `/subscribers/names` route returns a JSON response containing an array of subscribers' names and the channels they are subscribed to.
  
  
  ```javascript
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
  ```
  
-  The '/subscribers/:id' route takes a parameter representing a subscriber's ID and returns a JSON response with the subscriber's details, including their name, email, and subscribed channels, provided the ID is a valid MongoDB hexadecimal ID. If the ID is invalid, the server returns an error message.
 
    ```javascript
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

              if (!subscriber) {
                  return res.status(400).send({ message: 'Subscriber not found.' });
              }

              res.status(200).send(subscriber);

          } catch (err) {
              res.status(400).send({
                  message: err.message
              })
          }
      })

    ```

### Schema Details

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

- It is a Mongoose schema for a "Subscriber" model. The schema has three fields: name, subscribedChannel, and subscribedDate. The name and subscribedChannel fields are of type String and are required, meaning that they must be provided when creating a new subscriber. The subscribedDate field is of type Date, also required, and has a default value of the current date and time.

- The schema is defined using the Mongoose Schema constructor, and the resulting schema object is exported as a Mongoose model using the `mongoose.model()` method. The model method takes two arguments: the name of the model (in this case "Subscriber"), and the schema object that defines the model's fields and properties.

## Tests 

Tests have been written in `__tests__` folder using `chai`, `chai-http` for HTTP request/response testing , `chai-as-promised` for extending chai's capabilities to handle asynchronous operations that return promises along with `mocha` . 
