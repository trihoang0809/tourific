const express = require("express");
const { connect } = require("./db");
const userRoutes = require("./routes/userRoutes");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await connect();
});
