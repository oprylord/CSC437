import { Profile, Game, Round, Credential } from "server/models";

export interface Model {
  Credential?: Credential;
  Profile?: Profile;
  Game?: Game;
  Games?: Game[];
  Round?: Round;
  Rounds?: Round[];
}

export const init: Model = {};