const express = require("express");
const app = express();
const cors = require("cors");
const mainRouter = require("./routes/index");
require("dotenv").config();

const PORT = process.env.PORT;
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/api/v1", mainRouter);

require("./configuration/database").connect();
app.listen(PORT, () => {
  console.log(`App is running in PORT: ${PORT}`);
});
