# router.test.js
This test case is for API. The test case uses the `chai` testing framework along with `chai-http` to test the server and API endpoints. The test case sets up the server and a test database, adds sample data to the database, and then tests various API endpoints, including retrieving all subscribers, retrieving subscribers by name, and retrieving a single subscriber by ID. The test case also tests error handling for invalid subscriber IDs or IDs that do not exist in the database.

# schema.test.js
This test case is for the `Subscriber` model in a Node.js application. It uses the `chai` assertion library and `chai-as-promised` plugin to write unit tests for various scenarios related to the creation and retrieval of subscribers.

The `before` hook establishes a connection to the test database, while the `after` hook drops the test database and disconnects from it. The `afterEach` hook deletes all subscribers from the test database to ensure each test is independent.

The test cases include one to ensure that a new subscriber can be created with the expected properties and saved to the database. Two other test cases check if saving a subscriber without a name or a subscribedChannel throws a validation error. The last test case ensures that a subscriber can be found by ID from the database.
