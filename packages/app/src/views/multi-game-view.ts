// @ts-nocheck
import { define, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property } from "lit/decorators.js";
import { Game } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import { SingleGameElement } from "../components/gameObj";

export class MultiViewElement extends View<Model, Msg> {
  static uses = define({
    "game-object": SingleGameElement
  })

  @property()
  get games(): Game[] | undefined {
    console.log(this.model)
    return this.model.games;
  }


  constructor() {
    super("majoogs:model");
    

  }
  render() {
    return html`
        ${this.games?.map((game) => {
            const players = game.people.map((person) => [person, game.Scores[person]]);
            return html`
                <game-object
                    name="${game.id}"
                    .players="${players}"
                    .people="${game.people}"
                    .scores="${game.Scores}"
                ></game-object>
            `;
        })}
  
      <a href="/app/createGame" >
        <box> + Create a New Game! 
          </box>
        </a>
    `}
  connectedCallback() {
    super.connectedCallback(); 
    this.dispatchMessage(["game/all", {}]);
    console.log("wedidit");
    console.log(this.model);
    
  }
 
  static styles = css`
    box {
      text-align: center;
    font-size: 30px;
    display: block;
    align-items: center;
    margin: 20px;
    width:auto;
    border:solid 7px var(--color-border);
    font-family:"Courier New Bold", monospace;
    flex-direction: column; //trigger for this to switch between
    }  `;
}
