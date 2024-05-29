import {html, LitElement} from 'lit';
import style from './styles.css.js';

/**
 * An example element.
 */
export class AskQuestionButton extends LitElement {
    static get properties() {
        return {};
    }

    constructor() {
        super();
    }

    static styles = [style];

    onButtonClick() {
        console.log('Here');
    }

    render() {
        return html`
            <button @click="${this.onButtonClick}">+ Ask a question</button>
        `;
    }
}

window.customElements.define('ask-question-button', AskQuestionButton);
