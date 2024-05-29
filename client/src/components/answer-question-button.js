import {html, LitElement} from 'lit';
import style from './styles.css.js';

/**
 * An example element.
 */
export class AnswerQuestionButton extends LitElement {
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
            <button @click="${this.onButtonClick}">Reply</button>
        `;
    }
}

window.customElements.define('answer-question-button', AnswerQuestionButton);
