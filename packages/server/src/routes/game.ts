import express, { Request, Response } from "express";
import games from "../services/game-svc";
import { Game } from "../models/game";
import { Round } from "../models/round";
import {authenticateUser} from "./auth";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {

    games
      .indexGame()
      .then((list: Game[]) => res.json(list))
      .catch((err) => res.status(500).send(err));
  });

router.get("/:GameId", (req: Request, res: Response) => {
  const { GameId } = req.params;

  games
    .get(GameId)
    .then((game: Game) => res.json(game))
    .catch((err) => res.status(404).send(err));
});



  router.post("/", (req: Request, res: Response) => {
    const newGame = {
      id: req.body.id,
      people: [req.body.player1, req.body.player2, req.body.player3, req.body.player4],
      Scores: {} as {[key:string]: number},
      Rounds: [] as Round[]
    };

    //make a round 0 with initial scores
    const initRound = {
      Winner: "InitialRound",
      RoundWinnings: {} as {[key:string]: number},
      Scores: {} as {[key:string]: number}
    };

    newGame.people.forEach(function (player){
      initRound.RoundWinnings[player] = 0;
      initRound.Scores[player] = 25000;
    });

    // put it in
    newGame.Rounds.push(initRound);

    //get scores from last round (round0)
    newGame.Scores = newGame.Rounds[newGame.Rounds.length - 1].Scores;

    games
      .create(newGame)
      .then((game: Game) => res.status(201).send(game))
      .catch((err) => res.status(500).send(err));
  });

router.post("/:GameId", (req: Request, res: Response) => {
const { GameId } = req.params;
const newRound = req.body;


    games
    .addRound(GameId, newRound)
    .then((game: Game) => res.json(game))
    .catch((err) => res.status(404).end());
});



export default router;