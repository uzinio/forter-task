import {html, LitElement} from 'lit';
import style from './styles.css.js';
import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import {questionType} from "../types/index.js";

export class MainBoard extends LitElement {
    static get properties() {
        return {
            questions: {type: [questionType]},
            gotUpdate: Boolean,
        };
    }

    shouldUpdate(changedProps) {
        const currentVal = this.gotUpdate;
        this.gotUpdate = false;
        return currentVal;
    }

    constructor() {
        super();
        this.socket = io('http://localhost:3000', {
            extraHeaders: {
                "Access-Control-Allow-Origin": "*"
            }
        });
        this.socket.on('new-connection', (_data) => {
            this.questions = _data.questions;
            console.log(this.questions);
            this.gotUpdate = true;
        });
        this.socket.on('question-created', (createdQuestion) => {
            this.questions.push(createdQuestion);
            this.gotUpdate = true;
        });
        this.socket.on('question-updated', (updatedQuestion) => {
            const filteredQuestions = this.questions.filter(q => q.questionMetadata.id !== updatedQuestion.questionMetadata.id);
            filteredQuestions.push(updatedQuestion);
            this.questions = filteredQuestions;
            this.gotUpdate = true;
        });
    }

    static styles = [style];


    onButtonClick() {
        console.log('Here');
    }

    render() {
        return html`
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta name="generator" content="Hugo 0.122.0">
                <title>Forter QnA</title>

                <script src="/node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js"></script>
                <script src="/node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js"></script>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

            </head>
            <body>
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div class="container-fluid">
                    <div class="collapse navbar-collapse" id="navbarCollapse">
                        <ul class="navbar-nav me-auto mb-2 mb-md-0">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li class="nav-item">
                                <form class="d-flex" role="search">
                                    <input class="form-control me-2" type="search" placeholder="Search"
                                           aria-label="Search">
                                    <button class="btn btn-outline-success" type="submit"
                                            @click="${this.onButtonClick}">Search
                                    </button>
                                </form>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="#">Settings</a>
                            </li>
                        </ul>
                        <!-- search button and box-->

                    </div>
                </div>
            </nav>

            <main class="container">
                <div class="bg-body-tertiary p-5 rounded">
                    <h1 class="text-center">Forter QnA</h1>
                    <p class="lead text-center">Ask anything, Answer whatever</p>
                    ${this.questions ? this.questions.map((question) =>
                            html`
                                <question-component .data="${question}"></question-component>`
                    ) : html`<h1>Loading...</h1>`}
                </div>
            </main>

            </body>
        `;
    }
}

window.customElements.define('main-board', MainBoard);
