//@ts-nocheck
import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import { Game, Round, GameShell } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "game/create":
      //takes gameShell, id & players
        createGame(message[1], user).then((game) =>
        apply((model) => ({ ...model, game }))
          );
      break;

    case "game/select":
        selectGame(message[1], user).then((game) =>
        apply((model) => ({ ...model, game }))
          );
    break;
    
    case "game/all":
        everyGame(message[1], user).then((games) =>
        apply((model) => ({ ...model, games }))
          );
    break;
    

    case "game/addRound":
        addRound(message[1], user).then((game) =>
        apply((model) => ({ ...model, game }))
          );
        break;
    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled Auth message "${unhandled}"`);
  }
}

function createGame(  
    msg: {game: GameShell},
   user: Auth.User){
    return fetch(`/api/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...Auth.headers(user)
        },
        body: JSON.stringify(msg.game)
      })
      .then((response: Response) => {
        if (response.status === 200) return response.json();
        return undefined;
      })
      .then((json: unknown) => {
        if (json) return json as Game;
        return undefined;
      });
    }

function selectGame(
    msg: {GameId: string},
    user: Auth.User)
{
    return fetch(`/api/games/${msg.GameId}`, {
      method: "GET",
      headers: Auth.headers(user)
    })
      .then((response: Response) => {
        if (response.status === 200) return response.json();
        return undefined;
      })
      .then((json: unknown) => {
        if (json) return json as Game;
        return undefined;
      });
  }

  function everyGame(
    msg: {},
    user: Auth.User){
      return fetch(`/api/games`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...Auth.headers(user)
        },
      })
      .then((response: Response) => {

        if (response.status === 200) return response.json();
        return undefined;
      })
      .then((json: unknown) => {
        if (json) return json as Game[];
        return undefined;
      });    }
  
  


function addRound(
    msg:{GameId: string, round: Round},
    user: Auth.User){
    return fetch(`/api/games/${msg.GameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...Auth.headers(user)
        },
        body: JSON.stringify(msg.round)
      })
      .then((response: Response) => {
        if (response.status === 200) return response.json();
        return undefined;
      })
      .then((json: unknown) => {
        if (json) return json as Game;
        return undefined;
      });
    }

