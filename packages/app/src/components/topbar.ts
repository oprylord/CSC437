import { LitElement, css, html } from "lit";
import { Dropdown, define, Events, Auth, Observer } from "@calpoly/mustang";
import { property } from "lit/decorators.js";

export class topbar extends LitElement {
  static uses = define({
    "drop-down": Dropdown.Element
  });


  @property()
  username = "anonymous";

  render() {
    return html`
      <header>
      <head>
      <link rel="stylesheet" href="../../styles/index.css">
      <link rel="stylesheet" href="../../styles/reset.css">
      <link rel="stylesheet" href="../../styles/tokens.css">
      </head>
      <header class="topbar">    
        <a href="/app" style="text-decoration:none">Minefield Mahjong!</a>
        <drop-down class="czechbox">
          <a  class="red" slot="actuator">Welcome, ${this.username}</a>

          <ul style="  list-style-type: none;">

          <li>
        <label class="czechbox2"
        @change=${toggleDarkMode}>
        <input type="checkbox" autocomplete="off"/>
        Dark Mode
        </label>
        </li>

          <li>
        <label class="czechbox2">
        <a class= "czechbox2" style="text-decoration:none" href="/app/login">${this.username == "anonymous"? html`Log In`:html`<a @click=${signOutUser}>Sign Out</a>`} </a>
        </label>
        </li>
          </ul>


      </drop-down>
        </header>


      </header>
    `;
  }
  _authObserver = new Observer<Auth.Model>(
    this,
    "majoogs:auth"
  );

connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe(({ user }) => {
    if (user) {
      console.log("HELP")
        this.username = user.username;
    }
    });
}



  static styles = css`

a.red{
  color:rgb(168,0,0);
}

.czechbox{

    color:rgb(168,0,0);
    font-size: 20px;
    text-align: right;
    border-radius: 10px;
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 5px 10px;
    background-color: #383838;
    white-space: nowrap; 

    
}

.czechbox2{

    color:rgb(168,0,0);
    font-size: 20px;
    text-align: center;
    border-radius: 5px;
    right: 0px;
    top: 10px;
    padding: 5px 5px;
    background-color: #383838;
    white-space: nowrap; 
    margin: 0px 0px;    
}

  .topbar{
  font-size: 50px;
  height: 15vh;
  background-color: var(--color-background-header);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text-header); 
  }

  `;
}

type Checkbox = HTMLInputElement & { checked: boolean };


function toggleDarkMode(ev: InputEvent) {
  const target = ev.target as Checkbox;
  const checked = target.checked;

  Events.relay(ev, "dark-mode", { checked });
}
function signOutUser(ev: Event) {
  Events.relay(ev, "auth:message", ["auth/signout"]);
}
