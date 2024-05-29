import {LitElement, html} from 'lit';
import style from './styles.css.js';

/**
 * An example element.
 */
export class QuestionComponent extends LitElement {
    static styles = [style];

    render() {
        return html`
            <script src="/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
            <script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
            <div class="card">
                <div class="card-body">
                    This is some text within a card body.
                </div>
            </div>
        `;
    }
}

window.customElements.define('question-component', QuestionComponent);
