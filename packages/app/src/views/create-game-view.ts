import { define, View, Rest, Form } from "@calpoly/mustang";
import { css, html } from "lit";
import { Msg } from "../messages";
import { Model } from "../model";



export class CreateViewElement extends View<Model, Msg> {
  static uses = define({
    "restful-form": Rest.FormElement,
    "mu-form": Form.Element,

  })

  render() {

    return html`
    <h2>Create a New Game</h2>
<p>Keep track of your scores with your friends!</p>
<restful-form new src="/api/games/">
  <label>
    <span>Game Name</span>
    <input name="id" autocomplete="off" />
  </label>
  <label>
    <span>Player 1:</span>
    <input name="player1" autocomplete="off" />
  </label>
  <label>
    <span>Player 2:</span>
    <input name="player2" autocomplete="off" />
  </label>
  <label>
    <span>Player 3:</span>
    <input name="player3"  autocomplete="off" />
  </label>
  <label>
    <span>Player 4:</span>
    <input name="player4" autocomplete="off" />
  </label>
</restful-form>
  
   
    `;
  }

  constructor() {
    super("majoogs:model");

  }

  connectedCallback() {
    super.connectedCallback(); 
    
  }
  
  
    static styles = css`
  h2{
    color: var(--color-text-header);
  }
  p{
    color: var(--color-text-header);
  }
  span{
    color: var(--color-text-header);
  }
  `;
  
}
