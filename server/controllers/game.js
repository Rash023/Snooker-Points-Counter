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
    console.log(user);
    if (!user || !data) {
      return res.status(400).json({
        success: false,
        message: "Error Occurred!",
      });
    }

    const gameNo = Math.floor(1000 + Math.random() * 9000);
    gameNo.toString();
    const players = data.map((p) => ({ name: p.name, points: 0 }));
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
    const token = req.header("Authorization").replace("Bearer ", "").trim();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.userId;

    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { gameNo } = req.body;
    const game = await Game.findOne({ gameNo });

    if (!game) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found" });
    }

    user.games = user.games.filter((g) => g.toString() !== game._id.toString());
    await user.save();

    await Game.findByIdAndDelete(game._id);

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

//handler to get all the games of the user
exports.getAllGames = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "").trim();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const id = decodedToken.userId;

    const user = await User.findById(id).populate("games");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      games: user.games,
    });
  } catch (err) {
    console.error("Error fetching games:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//handler to update scores

exports.updateScore = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "").trim();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { gameNo, players } = req.body;
    if (gameNo === undefined || players == undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing gameNo, playerIndex, or points",
      });
    }

    const game = await Game.findOne({ gameNo });
    if (!game) {
      return res
        .status(404)
        .json({ success: false, message: "Game not found" });
    }

    game.players = players;
    await game.save();

    return res.status(200).json({
      success: true,
      message: "Score updated successfully",
      game,
    });
  } catch (err) {
    console.error("Error updating score:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//handler to add player in the game (optional)
exports.addPlayer = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "").trim();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { gameNo, playerName } = req.body;

    if (!gameNo || !playerName) {
      return res.status(400).json({
        success: false,
        message: "Missing gameNo or playerName",
      });
    }

    const game = await Game.findOne({ gameNo });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    game.players.push({ name: playerName, points: 0 });
    await game.save();

    return res.status(200).json({
      success: true,
      message: "Player added successfully",
      game,
    });
  } catch (err) {
    console.error("Error adding player:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//handler to get games by game No
exports.getGameByNumber = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "").trim();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    const { gameNo } = req.body;
    if (gameNo == "") {
      return res.status(400).json({
        success: false,
        message: "Invalid game number",
      });
    }

    const game = await Game.findOne({ gameNo });
    if (!game) {
      return res.status(404).json({
        success: false,
        message: `Game #${gameNumber} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      game,
    });
  } catch (err) {
    console.error("Error fetching game:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
