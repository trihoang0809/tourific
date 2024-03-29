const { MongoClient, ObjectId } = require("mongodb");
const { client } = require("../db");

const dbName = "databaseName";
const db = client.db(dbName);
const usersCollection = db.collection("users");

async function createUser(userData) {
  const result = await usersCollection.insertOne(userData);
  return result;
}

async function getUserById(userId) {
  const result = await usersCollection.findOne({ _id: new ObjectId(userId) });
  return result;
}

module.exports = { createUser, getUserById };
