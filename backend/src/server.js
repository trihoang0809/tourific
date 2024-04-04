import { PrismaClient } from "@prisma/client";
const express = require("express");
const { connect } = require("./db");
const userRoutes = require("./routes/userRoutes");
const app = express();
const port = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(express.json());
app.use(userRoutes);

app.get("/", async (req, res) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: "hi",
    },
    include: {
      followedBy: true,
    },
  });

  user.followedBy;
});

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await connect();
});
