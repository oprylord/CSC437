import {Round} from "./round.js"
export interface Game {
    id: string,
    people: Array<String>;
    Scores: {[key:string]: number};  
    Rounds: Array<Round>;
}