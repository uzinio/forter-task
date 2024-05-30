import {LitElement, html} from 'lit';
import style from './styles.css.js';
import {questionType} from "../types/index.js";
import {icons} from "./icons.js";

export class QuestionComponent extends LitElement {
    static get properties() {
        return {
            data: {type: questionType},
        };
    }

    static styles = [style];

    extractDateString(ms) {
        const createdDate = new Date(ms);
        return createdDate.toLocaleDateString() + ',' + createdDate.toLocaleTimeString();
    }

    render() {
        const createdDateString = this.extractDateString(this.data.questionMetadata.created);
        const updateDateString = this.extractDateString(this.data.questionMetadata.updated);

        return html`
            <script src="/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
            <script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

            <div class="card text-center question">
                <div class="card-header">
                    <div class="float-left">
                        ${icons.patchQuestion}
                    </div>
                    
                    <div>
                        ${this.data.content}
                    </div>
                    <div class="float-right">
                        ${icons.personArmsUp}
                        ${this.data.questionMetadata.askedBy.nickName}
                    </div>

                </div>
                <div class="card-body answers-container">
                    ${this.data.answers.map((answer) =>
                            html`
                                <answer-component .data="${answer}"></answer-component>`
                    )}
                </div>
                <div class="card-footer text-center">
                    <div class="float-left">
                        <span class="badge badge-pill badge-primary">Asked</span>
                        ${createdDateString}
                        
                        ${createdDateString === updateDateString ? '' : html`
                            <span class="badge badge-pill badge-secondary">Updated</span>
                            ${updateDateString}
                        `}
                        
                        
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
