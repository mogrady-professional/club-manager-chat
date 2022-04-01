const dotenv = require("dotenv"); // Bring in the Environmental Variables package
dotenv.config(); // Load in all of the values we have defined within the .env file

// MongoClient https://docs.mongodb.com/drivers/node/current/fundamentals/connection/
const { MongoClient } = require("mongodb");

// Connection String
const client = new MongoClient(process.env.CONNECTIONSTRING); // Use the CONNECTIONSTRING

// Dont know how long it will to craete this connection so need to use an async function

async function start() {
    // Use the .connect mongoDB method
    await client.connect(); // don't know how long this will take! so add await

    //   eventually, when it completes, continue..
    // module.exports = client.db(); // returns the db object  and exports it!
    module.exports = client; // returns the db object  and exports it!

    // Start the express app here;
    const app = require("./app");
    app.listen(process.env.PORT);
}

// Call it
start();