# Structure and contents of **src** folder. 

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

- router-logic - It has `app.js` containing router logic for our API. 

- `index.js` - starts a server using Express and connects to a MongoDB database using Mongoose.
    - it imports the Express and Mongoose modules and creates an instance of the app using the app.js file. It then sets up middleware to parse incoming JSON and URL-encoded data.
    - Next, it sets up a connection to a MongoDB database using the `mongoose.connect()` method and logs any errors that occur. Once the connection is successful, it logs a message indicating that the connection has been established.
    - Finally, it starts the server by calling the `app.listen()` method, which takes a port number and a callback function. When the server starts listening on the specified port, the callback function logs a message indicating that the app is running.
               
