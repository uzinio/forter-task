import {LitElement, html} from 'lit';
import style from './styles.css.js';
import {questionType, userInfoType} from "../types/index.js";
import {icons} from "./icons.js";
import {extractDateString} from "./common.js";

export class QuestionComponent extends LitElement {
    static get properties() {
        return {
            data: {type: questionType},
            userInfo: {type: userInfoType}
        };
    }

    static styles = [style];

    render() {
        const createdDateString = extractDateString(this.data.questionMetadata.created);
        return html`
            <script src="/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
            <script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

            <div class="card text-center question">
                <div class="card-header">
                    <div class="container">
                        <div class="row">
                            <div class="col text-right">
                                ${icons.personArmsUp}
                                ${this.data.questionMetadata.askedBy.nickName}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                ${this.data.content}
                            </div>
                        </div>
                    </div>


                </div>

                <answer-question-card .data="${this.data}" .userInfo="${this.userInfo}"></answer-question-card>

                <div class="card-body answers-container">
                    ${this.data.answers.sort((a, b) => a.created > b.created ? -1 : 1).map((answer) =>
                            html`
                                <answer-component .data="${answer}"></answer-component>`
                    )}
                </div>
                <div class="card-footer text-center">
                    <div class="float-left">
                        <div class="float-left">
                            ${icons.patchQuestion}
                        </div>
                        <date>
                            ${createdDateString}
                        </date>

                    </div>
                    <div class="float-right">
                        ${`Answers: ${this.data.answers.length}`}
                    </div>
                </div>
            </div>
        `;
    }
}

window.customElements.define('question-component', QuestionComponent);
