import { Schema, Model, Document, model } from "mongoose";
import { Game } from "../models/game";
import { Round } from "../models/round";

const RoundSchema = new Schema<Round>(
    {
        Winner: {type:String},
        RoundWinnings: { type: Map, of: Number, required: true },
        Scores: { type: Map, of: Number, required: true },
    },
    { collection: "Rounds" }
  );

const GameSchema = new Schema<Game>({
    id: { type: String, required: true },
    people: { type: [String], required: true },
    Scores: { type: Map, of: Number, required: true },
    Rounds: { type: [RoundSchema], required: true }
  }, { collection: "Games" });

  const GameModel = model<Game>("Game", GameSchema);
  const RoundModel = model<Round>("Round", RoundSchema);

  function indexGame(): Promise<Game[]> {
    return GameModel.find();
  }
  function indexRound(): Promise<Round[]> {
    return RoundModel.find();
  }

  
  function get(GameId: String): Promise<Game> {
    return GameModel.find({ id: GameId})
      .then((list) => list[0])
      .catch((err) => {
        throw `${GameId} Not Found`;
      });
  }
  
  function create(game: Game): Promise<Game> {
    const p = new GameModel(game);
    return p.save();
  }
  
  function addRound(
    GameId: String,
    round: Round
  ): Promise<Game> {
    return GameModel.findOne({ id:GameId }) //just gameid?
      .then((found) => {
        if (!found) throw `${GameId} Not Found`;
        else
        return GameModel.findByIdAndUpdate(
            found._id,
            { $push: { Rounds: round },$set: {Scores: round.Scores}},
            { new: true }
        );
      })
      .then((updated) => {
        if (!updated) throw `${GameId} not updated`;
        else return updated as Game;
      });
  }


  
  export default { indexGame, indexRound, get, create, addRound};
  