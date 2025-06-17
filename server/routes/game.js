const express = require("express");
const {
  createGame,
  deleteGame,
  getAllGames,
  updateScore,
  addPlayer,
  getGameByNumber,
} = require("../controllers/game");
const { authMiddleWare } = require("../middlewares/user");
const gameRouter = express.Router();

gameRouter.post("/create", createGame);
gameRouter.delete("/delete", deleteGame);
gameRouter.get("/allGames", getAllGames);
gameRouter.post("/updateScore", updateScore);
gameRouter.post("/addPlayer", addPlayer);
gameRouter.get("/getGameByNo", getGameByNumber);
module.exports = gameRouter;
