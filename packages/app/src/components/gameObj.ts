import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class SingleGameElement extends LitElement {
    @property()
    summary: string = "";

    @property()
    name: string = "";

    @property()
    scores: Number[] = [];

    @property()
    people: string[] = [];

    @property()
    players: [string, Number][] = [];
  

    render() {
      return html`
      <a href="/app/game/${(this.name)}">
      <box>
      <h1>${this.name}</h1>
      <box_footer>
      ${this.players.map((player) => html`
        <playerbox>
          ${player[0]} 
          <br>
          ${player[1]} 
        </playerbox>`)}
        <box_footer>
    </box>
    </a>
      `;
    }
  
    static styles = css`

    a{
      color: var(--color-text-header);
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
    margin: 20px;
    width:20%;
    border:solid 7px var(--color-border);
    }

    `;
  }