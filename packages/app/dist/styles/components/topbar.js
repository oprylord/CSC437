import { prepareTemplate } from "./template.js";
import { relayEvent } from "./index.js";
import "./drop-down.js";



export class TopbarElement extends HTMLElement {
    static template = prepareTemplate(`
      <template>
      <head>
      <link rel="stylesheet" href="./styles/index.css">
      <link rel="stylesheet" href="./styles/reset.css">
      <link rel="stylesheet" href="./styles/tokens.css">
      </head>
      <header class="topbar">    
        Minefield Mahjong!

        <label class="czechbox"
        onchange="relayEvent(
        event, 
        'dark-mode', 
        {checked: event.target.checked})">
        <input type="checkbox" autocomplete="off"/>
        Dark Mode
        </label>


        
        </header>


      </template>
    `);
    constructor() {
        super();
    
        this.attachShadow({ mode: "open" }).appendChild(
          TopbarElement.template.cloneNode(true)
        );
      //   this.shadowRoot
      // .querySelector("label[class='czechbox']")
      // .addEventListener("dark-mode", (event) =>
      //   toggleDarkMode(
      //       event.currentTarget,
      //       event.detail.checked
      //   )
      //   );
  }
  // toggleDarkMode(page, checked) {
  //   page.classList.toggle("dark-mode", checked);
  //   }
      }
  
  
  
  customElements.define("top-nav", TopbarElement );