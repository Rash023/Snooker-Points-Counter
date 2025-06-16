const express = require("express");
const { createGame, deleteGame } = require("../controllers/game");
const gameRouter = express.Router();

gameRouter.post("/create", createGame);
gameRouter.delete("/delete", deleteGame);

module.exports = gameRouter;
