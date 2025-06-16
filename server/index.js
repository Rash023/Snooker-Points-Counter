const express = require("express");
const app = express();
const cors = require("cors");
const mainRouter = require("./routes/index");
require("dotenv").config();

const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/v1", mainRouter);

app.use(cors());
require("./configuration/database").connect();
app.listen(PORT, () => {
  console.log(`App is running in PORT: ${PORT}`);
});
