const { MongoClient } = require("mongodb");

// Replace the url string with MongoDB connection string.
const uri = "mongodb_connection_string";
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
  }
}

module.exports = { client, connect };
