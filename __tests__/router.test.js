const app = require('../src/router-logic/app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const mongoose = require('mongoose')
const subscriberModel = require('../src/models/subscribers')
const data = require('../src/helper-files/data')

// Adding chaiHttp middleware to chai
chai.use(chaiHttp)

// Testing the server
describe('testing server', () => {

    // Declaring variables for the server and a sample document
    let server
    let sampleDoc

    // Before testing, set up the server, database connection, and sample data
    before(async () => {

        // Starting the server on port 3000
        server = app.listen(3000, () => {
            console.log('Server started')
        })

        // Connecting to the test database
        const DATABASE_URL = "mongodb://localhost:27017/TestSubscribers";
        mongoose.connect(DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const db = mongoose.connection
        
        // Logging any errors
        db.on('error', (err) => console.log(err))

        // Logging when the connection is successful
        db.once('open', () => console.log('connected to database'))

        // Deleting any existing documents and adding sample data
        await subscriberModel.deleteMany({})
        await subscriberModel.insertMany(data)

        // Finding a sample document to use in later tests (/subscribers/:id)
        sampleDoc = await subscriberModel.findOne({ name: 'John Doe' })
    })

    // After testing, closing the server and disconnecting from the database
    after(async () => {
        server.close(() => {
            console.log('Server stopped');
        })
        await mongoose.disconnect();
    })

    describe('testing the API', () => {

         // Testing the welcome message and endpoints
        it('should return welcome message with endpoints', async () => {
            const res = await chai.request(app).get('/')

            chai.expect(res.status).to.equal(200)
            chai.expect(res.body.welcome).to.equal('This is an API created for Youtube Subscribers Backend Project')
            chai.expect(res.body.endpoints).to.deep.equal({
                toGetAllSubsribers: '/subscribers',
                toGetAllSubsribersNames: '/subscribers/names',
                toGetSubscribersByID: '/subscribers/:id'
            })
        })

        // Testing endpoint '/subscribers' which gets all subscribers with their subscribed channel. 
        it('should return subscribers', async () => {

            const res = await chai.request(app).get('/subscribers')
            
            chai.expect(res.status).to.equal(200)
            chai.expect(res.body.subscribers[0].name).to.equal("Jeread Krus")
            chai.expect(res.body.subscribers[0].subscribedChannel).to.equal("CNET")
            chai.expect(res.body.subscribers[1].name).to.equal("John Doe")
            chai.expect(res.body.subscribers[1].subscribedChannel).to.equal("freeCodeCamp.org")
            chai.expect(res.body.subscribers[2].name).to.equal("Lucifer")
            chai.expect(res.body.subscribers[2].subscribedChannel).to.equal("Sentex")
        })

        // Testing the endpoint '/subscribers/names' which returns all subscribers with name and subscribedChannel
        it('should return subscribers with names', async () => {
            const res = await chai.request(app).get('/subscribers/names')

            chai.expect(res.status).to.equal(200)

            // since this endpoint only returns docs with name and subscribedChannel I am expecting it to be equal to the given object. 
            chai.expect(res.body.subscribers).to.deep.equal([{
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
            }])
        })

        // Testing the endpoint '/subscribers/:id' which returns information about a particular element given the id. 
        it('should return subscribers with id', async () => {
            const res = await chai.request(app).get(`/subscribers/${sampleDoc._id}`)

            chai.expect(res.status).to.equal(200)
            chai.expect(res.body.name).to.equal('John Doe')
            chai.expect(res.body.subscribedChannel).to.equal('freeCodeCamp.org')
        })

        // Testing for status 400 and error message if id can't be found
        it("Should return status 400 and error message if id not found", async () => {
            const res = await chai.request(app).get(`/subscribers/123456`)

            chai.expect(res.status).to.equal(400)
            chai.expect(res.body.message).to.equal('Subscriber not found for id 123456')
        })
    })

})