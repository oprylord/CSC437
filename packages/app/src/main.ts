import { Auth, History, Store, define, Switch } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import { html } from "lit";
import { topbar } from "./components/topbar";
import {GameViewElement} from "./views/single-game-view.ts";
import {CreateViewElement} from "./views/create-game-view.ts";
import { SignupViewElement } from "./views/signup-view.ts";
import { LoginViewElement } from "./views/login-view.ts";
import {MultiViewElement} from "./views/multi-game-view.ts";
const routes=[

  { 
    path:"/app/createGame",
    view: () => html`
    <create-view></create-view>`
  },
  { path:"/app/game/:id",
    view: (params:Switch.Params) => html`
    <game-view game-id=${params.id}></game-view>`
  },
  { path:"/app/login",
    view: () => html`
    <login-view></login-view>`
  },
  { path:"/app/register",
  view: () => html`
  <signup-view></signup-view>`
  },  
  {
    path:"/app",
    view:()=>html`
    <multi-view></multi-view>`
  },
  {
    path:"/",
    redirect:"/app"
  }

];
define({
  "mu-auth": Auth.Provider,
  "mu-store": class AppStore extends Store.Provider<
    Model,
    Msg
  > {
    constructor() {
      super(update, init, "majoogs:auth");
    }
  },
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "majoogs:history");
    }
  },
  "top-nav": topbar,
  "game-view": GameViewElement,
  "create-view": CreateViewElement,
  "signup-view": SignupViewElement,
  "login-view": LoginViewElement,
  "multi-view": MultiViewElement
});