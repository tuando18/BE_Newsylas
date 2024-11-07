var db = require("../config/db");

var userSchema = new db.mongoose.Schema(
  {
    walletAddress: { type: String, required: true, unique: true },
    tokensEarned: { type: Number, default: 0 },
  },
  {
    collection: "UserSol",
  }
);

let UserSolModel = db.mongoose.model("UserSolModel", userSchema);

module.exports = { UserSolModel };
