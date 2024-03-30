const express = require("express");
const { createUser, getUserById } = require("../src/models/User");

const router = express.Router();

// Route to create a new user
router.post("/users", async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.toString());
  }
});

// Route to get a user by id
router.get("/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = router;
