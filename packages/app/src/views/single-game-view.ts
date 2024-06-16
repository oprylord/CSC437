 // @ts-nocheck
 import { define, View, Form } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Game } from "server/models";
import { Msg } from "../messages";
import { Model } from "../model";
import { AddRoundElement } from "../components/add-round";



export class GameViewElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
    "add-round": AddRoundElement
  })
  @property({ attribute: "game-id", reflect: true })
  gameid = "";


  @property()
  get games(): Game[] | undefined {
    return this.model.games;
  }

  @state()
  get game(): Game | undefined {
    return this.model.game;
  }

  @state()
  get newRound(): Round | undefined {
    return this.model.newRound;
  }

  
  

  constructor() {
    super("majoogs:model");
  }

  render() {
    let game = this.game;
    const {a,b,c,d} = this.newRound || {};
    if (!game) {
      return html`<div>loading...</div>`;
    }
    const players = game.people.map((person) => [person, game.Scores[person]]);
    return html`
                <game-object
                    name="${game.id}"
                    .players="${players}"
                    .people="${game.people}"
                    .scores="${game.Scores}"
                ></game-object>
            
  

<box>
  
    ${game.Rounds.map((round) => html`
      <box_footer>
        ${Object.keys(round.RoundWinnings).map((player) => html`
        <playerbox>
        ${player} : ${round.RoundWinnings[player]}
    </playerbox>
        `)}
        </box_footer>
`)}
</box>


<box>
<box style="background:orange"> + Add a Round</box>
     <add-round
      .init=${this.newRound}
      .people=${game.people}
      @mu-form:submit=${(event: Form.SubmitEvent<Round>)=> this._handleSubmit(event)}></add-round>
</box>




    `;
  }
  connectedCallback() {
    super.connectedCallback(); 
    
  }

  _handleSubmit(event: Form.SubmitEvent<Round>) {
    console.log("HERE");
    console.log("ME",event.detail.a);
    const eventRound = {
      Winner: "RoundOne",
      RoundWinnings:this.game.people.map((person) => [person,(event.detail[person]?parseInt(event.detail[person]):0)]),
      Scores:this.game.people.map((person) => [person, parseInt(this.game?.Scores[person])+ (event.detail[person]?parseInt(event.detail[person]):0)])
    };
    this.dispatchMessage(["game/addRound",
        {
          GameId: this.gameid,
          round: eventRound
        }

    ]);
  }
  
  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    console.log("Routine Page Attribute Changed", name, oldValue, newValue);
    if (
      name === "game-id" &&
      oldValue !== newValue &&
      newValue
    ) {
      console.log("DISPATCHING")
      this.dispatchMessage([
        "game/select",
        { GameId: newValue }
      ]);
    }
    super.attributeChangedCallback(name, oldValue, newValue);
  }
    static styles = css`

    a{
      text-decoration: none;
    }


    box {
      text-align: center;
    font-size: 30px;
    display: block;
    align-items: center;
    margin: 20px;
    width:auto;
    border:solid 7px var(--color-border);
    color: var(--color-text-header);
    font-family:"Courier New Bold", monospace;
    flex-direction: column; //trigger for this to switch between
    }


    box_footer {
        align-self: center;
        display: flex;
      }

    playerbox{
        font-size: 30px;
    justify-content: center;
    text-align: center;
    align-items: center;
    padding: 50px 20px;
    width:25%;
    border:solid 7px var(--color-border);
    }

  `;
}
