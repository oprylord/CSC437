"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var game_svc_exports = {};
__export(game_svc_exports, {
  default: () => game_svc_default
});
module.exports = __toCommonJS(game_svc_exports);
var import_mongoose = require("mongoose");
const RoundSchema = new import_mongoose.Schema(
  {
    Winner: { type: String },
    RoundWinnings: { type: Map, of: Number, required: true },
    Scores: { type: Map, of: Number, required: true }
  },
  { collection: "Rounds" }
);
const GameSchema = new import_mongoose.Schema({
  id: { type: String, required: true },
  people: { type: [String], required: true },
  Scores: { type: Map, of: Number, required: true },
  Rounds: { type: [RoundSchema], required: true }
}, { collection: "Games" });
const GameModel = (0, import_mongoose.model)("Game", GameSchema);
const RoundModel = (0, import_mongoose.model)("Round", RoundSchema);
function indexGame() {
  return GameModel.find();
}
function indexRound() {
  return RoundModel.find();
}
function get(GameId) {
  return GameModel.find({ id: GameId }).then((list) => list[0]).catch((err) => {
    throw `${GameId} Not Found`;
  });
}
function create(game) {
  const p = new GameModel(game);
  return p.save();
}
function addRound(GameId, round) {
  return GameModel.findOne({ id: GameId }).then((found) => {
    if (!found) throw `${GameId} Not Found`;
    else
      return GameModel.findByIdAndUpdate(
        found._id,
        { $push: { Rounds: round }, $set: { Scores: round.Scores } },
        { new: true }
      );
  }).then((updated) => {
    if (!updated) throw `${GameId} not updated`;
    else return updated;
  });
}
var game_svc_default = { indexGame, indexRound, get, create, addRound };
