import { Round, GameShell/*,Profile*/  } from "server/models";

export type Msg =
  | ["game/create", {game: GameShell}]
  | ["game/select", { GameId: string }]
  | ["game/all", {}]
  | ["game/addRound", { GameId: string, round: Round }]

