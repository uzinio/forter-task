import {html, LitElement} from 'lit';
import style from './styles.css.js';
import {answerType} from "../types/index.js";
import {icons} from "./icons.js";
import {extractDateString} from "./common.js";

export class AnswerComponent extends LitElement {
    static get properties() {
        return {
            data: {type: answerType},
        };
    }

    static styles = [style];

    render() {
        const createdDateString = extractDateString(this.data.created);
        const answeredBy = this.data.answeredBy.nickName;
        return html`
            <script src="/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
            <script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
            <div class="card border-info bg-light mb-12" style="margin-top: 10px;">
                <div class="card-header text-left">
                    <div class="float-left">
                        ${answeredBy === "forter-bot" ? icons.bot : icons.personRaisedHands}
                        ${answeredBy}
                    </div>
                    <date class="float-right">
                        ${createdDateString}
                        ${icons.alarmFill}
                    </date>
                </div>
                <div class="card-body">
                    <p class="card-text">${this.data.content}</p>
                </div>
            </div>
        `;
    }
}

window.customElements.define('answer-component', AnswerComponent);
