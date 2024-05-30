import {html, LitElement} from 'lit';
import style from './styles.css.js';
import {questionType, userInfoType} from "../types/index.js";

export class AnswerQuestionCard extends LitElement {
    static get properties() {
        return {
            data: {type: questionType},
            answerQuestionInput: {type: String},
            userInfo: {type: userInfoType}
        };
    }

    constructor() {
        super();
    }

    async onSend() {
        console.log(this.userInfo);
        const answer = this.data;
        answer.content = this.answerQuestionInput;
        answer.answeredBy = {nickName: this.userInfo.nickName};
        delete answer.answers;
        console.log(answer);

        try {
            const response = await fetch("http://localhost:3000/answer-question", {
                method: "POST",
                body: JSON.stringify({answer}),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    handleAnswerQuestionInputChange(event) {
        console.log(event.target.value);
        this.answerQuestionInput = event.target.value;
    }

    static styles = [style];

    render() {
        return html`
            <script src="/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
            <script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

            <div class="card border-info bg-information mb-12" style="margin-top: 10px; background-color: white">
                <div class="card-header text-left">
                    <div class="float-left">
                        Offer your Answer
                    </div>
                    <date class="float-right">
                        <button type="button" class="btn btn-success" @click="${this.onSend}">
                            Send
                        </button>
                    </date>
                </div>
                <div class="card-body">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Blaa blaa blaaa I know everything...</span>
                        </div>
                        <input type="text"
                               value=${this.answerQuestionInput}
                               @input=${this.handleAnswerQuestionInputChange}
                               style="min-width: 700px; min-height: 60px;">
                    </div>
                </div>
            </div>
        `;
    }
}

window.customElements.define('answer-question-card', AnswerQuestionCard);
