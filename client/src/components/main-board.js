import {LitElement, html} from 'lit';
import style from './styles.css.js';
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

/**
 * An example element.
 */
export class MainBoard extends LitElement {
  static get properties() {
    return {
      /**
       * The name to say "Hello" to.
       * @type {string}
       */
      name: {type: String},

      /**
       * The number of times the button has been clicked.
       * @type {number}
       */
      count: {type: Number},
    };
  }

  constructor() {
    super();
    this.name = 'Bot';
    this.count = 0;
    this.socket = io('http://localhost:3000', {
      extraHeaders: {
        "Access-Control-Allow-Origin": "*"
    }});
    this.socket.on('new connection', console.log);
  }

  static styles = [style];

  render() {
    const {name, count} = this;
    return html`
      <div class="flex-container">
        <div class="col-1" style="background: white;">
          <p>Icon</p>
        </div>
        <div class="col-2" style="background: darkgoldenrod;">
          <ask-question-button></ask-question-button>
        </div>
        <div class="col-4" style="background: saddlebrown;">
          <p>Site's Name</p>
        </div>
        <div class="col-2" style="background: salmon;">
        </div>
        <div class="col-1" style="background: green;">
          <settings-button></settings-button>
        </div>


        ${[1,2,3,1,1,1,1,1].map((num) =>
            html`<div class="question">
              <question-component></question-component>
            </div>`
        )}
        
      </div>
    `;
  }
}

window.customElements.define('main-board', MainBoard);
