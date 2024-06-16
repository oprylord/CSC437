"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var game_exports = {};
__export(game_exports, {
  default: () => game_default
});
module.exports = __toCommonJS(game_exports);
var import_express = __toESM(require("express"));
var import_game_svc = __toESM(require("../services/game-svc"));
const router = import_express.default.Router();
router.get("/", (req, res) => {
  import_game_svc.default.indexGame().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:GameId", (req, res) => {
  const { GameId } = req.params;
  import_game_svc.default.get(GameId).then((game) => res.json(game)).catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
  const newGame = {
    id: req.body.id,
    people: [req.body.player1, req.body.player2, req.body.player3, req.body.player4],
    Scores: {},
    Rounds: []
  };
  const initRound = {
    Winner: "InitialRound",
    RoundWinnings: {},
    Scores: {}
  };
  newGame.people.forEach(function(player) {
    initRound.RoundWinnings[player] = 0;
    initRound.Scores[player] = 25e3;
  });
  newGame.Rounds.push(initRound);
  newGame.Scores = newGame.Rounds[newGame.Rounds.length - 1].Scores;
  import_game_svc.default.create(newGame).then((game) => res.status(201).send(game)).catch((err) => res.status(500).send(err));
});
router.post("/:GameId", (req, res) => {
  const { GameId } = req.params;
  const newRound = req.body;
  import_game_svc.default.addRound(GameId, newRound).then((game) => res.json(game)).catch((err) => res.status(404).end());
});
var game_default = router;
