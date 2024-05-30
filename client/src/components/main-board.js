import {html, LitElement} from 'lit';
import style from './styles.css.js';
import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import {questionType, userInfoType} from "../types/index.js";

export class MainBoard extends LitElement {
    static get properties() {
        return {
            questions: {type: [questionType]},
            userInfo: {type: userInfoType},
            nickNameInput: {type: String},
            questionInput: {type: String},
        };
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
            this.questions = this.questions.map(q => {
                const newQuestion = {...q, score: 1, styleClass: "question"};
                return newQuestion;
            });
        });
        this.socket.on('question-created', (createdQuestion) => {
            this.questions.push(createdQuestion);
        });
        this.socket.on('question-updated', (updatedQuestion) => {
            const filteredQuestions = this.questions.filter(q => q.questionMetadata.id !== updatedQuestion.questionMetadata.id);
            filteredQuestions.push(updatedQuestion);
            this.questions = filteredQuestions;
        });

        try {
            this.userInfo = JSON.parse(this.getCookie());
        } catch (err) {
            this.userInfo = undefined;
        }
        this.nickNameInput = '';
        this.questionInput = '';
    }

    static styles = [style];

    getCookie() {
        return document.cookie;
    }

    setCookie(value) {
        const stringify = JSON.stringify(value);
        document.cookie = stringify;
    }

    handleNickNameInputChange(event) {
        this.nickNameInput = event.target.value;
    }

    handleQuestionInputChange(event) {
        this.questionInput = event.target.value;
    }

    async onUpdateNickname(event) {
        event.preventDefault();
        try {
            const existingUserResponse = await fetch(`http://localhost:3000/user-info/${this.nickNameInput}`);
            const {userInfo} = await existingUserResponse.json();
            if (userInfo) {
                this.setCookie(userInfo);
                try {
                    this.userInfo = JSON.parse(this.getCookie());
                } catch (err) {
                    this.userInfo = undefined;
                } finally {
                    this.nickNameInput = '';
                }
                return;
            }

            const response = await fetch("http://localhost:3000/user-info", {
                method: "POST",
                body: JSON.stringify({user: {nickName: this.nickNameInput}}),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            });
            const {userInfo: createdUserInfo} = await response.json();
            this.setCookie(createdUserInfo);
            try {
                this.userInfo = JSON.parse(this.getCookie());
            } catch (err) {
                this.userInfo = undefined;
            } finally {
                this.nickNameInput = '';
            }
        } catch (err) {
            console.error(err);
        }
    }

    async onAskQuestion(event) {
        event.preventDefault();
        this.questions = [this.questions[0], this.questions[1]];
    }

    sortQuestions(questions) {
        return questions.sort((a, b) => {
            if (a.score > b.score) {
                return -1;
            }
            return a.questionMetadata.created > b.questionMetadata.created ? -1 : 1;
        });
    }

    render() {
        const {questions: currentQuestions} = this;
        const questions = currentQuestions || [];
        const sorted = this.sortQuestions(questions);
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
                    <div class="navbar-collapse" id="navbarCollapse">
                        <div class="container" style="min-width: 100%">
                            <div class="row">
                                <div class="col-3">
                                    <form class="d-flex" role="search">
                                        <input
                                                class="form-control me-2"
                                                type="text"
                                                placeholder=${(this.userInfo && this.userInfo.nickName) ? this.userInfo.nickName : 'nick name'}
                                                .value=${this.nickNameInput}
                                                @input=${this.handleNickNameInputChange}
                                                style="max-width: 60%">
                                        <button type="button" class="btn btn-primary" @click="${this.onUpdateNickname}">
                                            Log In
                                        </button>
                                    </form>
                                </div>
                                <div class="col-7"></div>
                                <div class="col-2">
                                    ${this.userInfo ?
                                            html`
                                                <div class="container">
                                                    <div class="row float-right">
                                                        <div class="col-sm">
                                                            <span class="badge badge-success">Connected</span>
                                                        </div>
                                                        <div class="col-sm">
                                                            <p style="color: white">${this.userInfo.nickName}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ` :
                                            html`
                                                <div class="container">
                                                    <div class="row float-right">
                                                        <div class="col-sm">
                                                            <span class="badge badge-danger">Not Connected</span>
                                                        </div>
                                                        <div class="col-sm">

                                                        </div>
                                                    </div>
                                                </div>
                                            `
                                    }
                                </div>
                            </div>
                        </div>
            </nav>

            <main class="container">
                <div class="bg-body-tertiary p-5 rounded">
                    <h1 class="text-center">Forter QnA</h1>
                    <p class="lead text-center">Ask Anything, Answer Whatever</p>
                    <div style="padding: 10px;">
                        <div class="card border-info bg-information mb-12"
                             style="margin-top: 10px; background-color: white">
                            <div class="card-header text-left">
                                <div class="float-left">
                                    Ask Anything
                                </div>
                                <date class="float-right">
                                    <button type="button" class="btn btn-success" @click="${this.onAskQuestion}">
                                        Ask
                                    </button>
                                </date>
                            </div>
                            <div class="card-body">
                                <div class="input-group">
                                    <input type="text"
                                           .value=${this.questionInput}
                                           @input=${this.handleQuestionInputChange}
                                           style="min-width: 700px; min-height: 60px;">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        ${sorted ? sorted.map((question) =>
                                html`
                                    <question-component .data="${question}" .userInfo="${this.userInfo}"
                                                        .styleClass=${question.styleClass}>
                                    </question-component>`
                        ) : html`<h1>Loading...</h1>`}
                    </div>
                </div>
            </main>
            </body>
        `;
    }
}

window.customElements.define('main-board', MainBoard);
