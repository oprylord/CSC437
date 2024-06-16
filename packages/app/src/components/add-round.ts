import {
  define,
  Form
} from "@calpoly/mustang";
import { html, LitElement } from "lit";
import { property } from "lit/decorators.js";


export class AddRoundElement extends LitElement {
  static uses = define({
    "mu-form": Form.Element,
  })

  @property()
  init?: string;

  @property()
  people: string[] = [];

  @property()
  a: Number = 0;


  render() {

    return html`
  <mu-form .init=${this.init}>
  <label>
    <span> ${this.people[0]}</span>
    <input name="${this.people[0]}"  type= "number" placeholder=0 autocomplete="off" />
  </label>
  <label>
    <span>${this.people[1]}</span>
    <input name="${this.people[1]}"  type= "number" autocomplete="off" />
  </label>
  <label>
    <span>${this.people[2]}</span>
    <input name="${this.people[2]}"  type= "number" autocomplete="off" />
  </label>
  <label>
    <span>${this.people[3]}</span>
    <input name="${this.people[3]}"  type= "number" autocomplete="off" />
  </label>
</mu-form>
  
   
    `;
  }
}