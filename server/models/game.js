const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  gameNo: {
    type: String,
    required: true,
  },
  players: [
    {
      name: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
});

module.exports = mongoose.model("Game", GameSchema);
