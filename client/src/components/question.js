import {LitElement, html} from 'lit';
import style from './styles.css.js';
import {questionType} from "../types/index.js";

export class QuestionComponent extends LitElement {
    static get properties() {
        return {
            data: {type: questionType},
        };
    }

    static styles = [style];

    render() {
        return html`
            <script src="/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
            <script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

            <div class="card text-center question">
                <div class="card-header">
                    ${this.data.content}
                </div>
                <div class="card-body">
                    <h5 class="card-title">${' by ' +  this.data.questionMetadata.askedBy.nickName}</h5>
                    
                </div>
                <div class="card-footer text-muted">
                    ${"2 days ago, " + this.data.answers.length + " answers"}
                </div>
            </div>
        `;
    }
}

window.customElements.define('question-component', QuestionComponent);
