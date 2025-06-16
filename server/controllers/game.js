const Game = require("../models/game");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
//handler to create games
exports.createGame = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "").trim();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.userId;
    const user = await User.findById(id);
    console.log("here");

    const data = req.body.players;
    console.log(data);
    if (!user || !data) {
      return res.status(400).json({
        success: false,
        message: "Error Occurred!",
      });
    }

    const gameNo = Math.floor(1000 + Math.random() * 9000);
    gameNo.toString();
    const players = data.map((p) => ({ name: p, points: 0 }));
    gameObject = { gameNo, players };
    const game = await Game.create(gameObject);
    console.log("game saved");
    user.games.push(game._id);
    await user.save();
    console.log("second");
    return res.status(201).json({
      success: true,
      message: "Game created successfully",
      game,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
//handler to delete games
exports.deleteGame = async (req, res) => {
  try {
    const { gameNo } = req.body.gameNo;
    const deleted = await Game.findOne({ gameNo: gameNo });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Game deleted successfully",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//handler to change turns

//handler to add player in the game (optional)
