const express = require("express");
const { SignUp, login } = require("../controllers/user");

const userRouter = express.Router();

userRouter.post("/signup", SignUp);
userRouter.post("/login", login);

module.exports = userRouter;
