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
            <div class="card question">
                <div class="card-body">
                    ${this.data.content + ' by ' +  this.data.questionMetadata.askedBy.nickName}
                </div>
            </div>
        `;
    }
}

window.customElements.define('question-component', QuestionComponent);
