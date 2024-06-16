import { define, View, Rest } from "@calpoly/mustang";
import { css, html } from "lit";
import { Msg } from "../messages";
import { Model } from "../model";


export class SignupViewElement extends View<Model, Msg> {

  static uses = define({
    "restful-form": Rest.FormElement
  })

  render() {
    
    return html`
    <h1>Register</h1>
    <restful-form new src="/auth/register">
    <label>
    <span>Username:</span>
    <input name="username" autocomplete="off" />
  </label>
  <label>
    <span>Password:</span>
    <input type="password" name="password" />
  </label>
  </restful-form>
  <p>Already signed up? Then you can
        <a href="/app/login">log in</a> instead.</p>
    `;
  }


  constructor() {
    super("majoogs:model");

  }
  connectedCallback() {
    super.connectedCallback(); 
  }

  static styles = css`
  `;
}
