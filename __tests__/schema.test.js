const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');

const Subscriber = require('../src/models/subscribers');

chai.use(chaiAsPromised);
const expect = chai.expect;

// Subscriber Model Test Suite
describe('Subscriber Model', () => {

  // Establishing connection to test database
  before(async () => {
    const DATABASE_URL = "mongodb://localhost:27017/TestSubscribers";
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  // Dropping the test database and disconnecting from it
  after(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  // Deleting all subscribers from test database
  afterEach(async () => {
    await Subscriber.deleteMany({});
  });

  // Creating a new subscriber object
  it('should create a new subscriber', async () => {
    const newSubscriber = new Subscriber({
      name: 'John Doe',
      subscribedChannel: 'freeCodeCamp.org'
    });

    // Saving the new subscriber object to database
    const savedSubscriber = await newSubscriber.save();

    // Assertion for saved subscriber object
    expect(savedSubscriber).to.have.property('_id');
    expect(savedSubscriber.name).to.equal('John Doe');
    expect(savedSubscriber.subscribedChannel).to.equal('freeCodeCamp.org');
    expect(savedSubscriber.subscribedDate).to.be.a('date');
  });


  // Creating a new subscriber object without name
  it('should not save a subscriber without a name', async () => {
    const newSubscriber = new Subscriber({
      subscribedChannel: 'freeCodeCamp.org'
    });

    // Expecting the new subscriber object without name to not save
    await expect(newSubscriber.save()).to.be.rejectedWith('Subscriber validation failed');
  });


  // Creating a new subscriber object without subscribed channel
  it('should not save a subscriber without a subscribedChannel', async () => {
    const newSubscriber = new Subscriber({
      name: 'John Doe'
    });

    // Expecting the new subscriber object without subscribed channel to not save
    await expect(newSubscriber.save()).to.be.rejectedWith('Subscriber validation failed');
  });

  
  // Creating a new subscriber object
  it('should find a subscriber by ID', async () => {
    const newSubscriber = new Subscriber({
      name: 'John Doe',
      subscribedChannel: 'freeCodeCamp.org'
    });

    // Saving the new subscriber object to database
    const savedSubscriber = await newSubscriber.save();

    // Finding the saved subscriber object by its ID
    const foundSubscriber = await Subscriber.findById(savedSubscriber._id);

    // Assertion for the found subscriber object
    expect(foundSubscriber).to.have.property('_id');
    expect(foundSubscriber.name).to.equal('John Doe');
    expect(foundSubscriber.subscribedChannel).to.equal('freeCodeCamp.org');
    expect(foundSubscriber.subscribedDate).to.be.a('date');
  });
});
