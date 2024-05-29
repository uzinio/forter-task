import {LitElement, html} from 'lit';
import style from './styles.css.js';
import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

/**
 * An example element.
 */
export class TopBar extends LitElement {
    static styles = [style];

    render() {
        return html`
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
        `;
    }
}

window.customElements.define('top-bar', TopBar);
