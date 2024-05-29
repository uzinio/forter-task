import {LitElement, html} from 'lit';
import style from './styles.css.js';

/**
 * An example element.
 */
export class QuestionComponent extends LitElement {
    static styles = [style];

    render() {
        return html`
            <div>
                <p>Question</p>
                <answer-question-button></answer-question-button>
            </div>
        `;
    }
}

window.customElements.define('question-component', QuestionComponent);
