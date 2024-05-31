import {html, LitElement} from 'lit';
import style from './styles.css.js';
import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import {questionType, userInfoType} from "../types/index.js";
import {createUserInfo, getUserInfo, search} from "../services/index.js";

export class MainBoard extends LitElement {
    static get properties() {
        return {
            questions: {type: [{question: {type: questionType, score: {type: Number}}}]},
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
            console.log('new-connection');
            const _questions = _data.questions;
            this.questions = _questions.map(q => {
                return {question: q, score: 0, styleClass: "question"};
            });
        });
        this.socket.on('question-created', async (createdQuestion) => {
            console.log('question-created');
            this.questions.push({question: createdQuestion, score: 1, styleClass: "question"});
            this.requestUpdate();
            if(this.questionInput) {
                await this.handleSuggestions();
            }
        });
        this.socket.on('question-updated', async (updatedQuestion) => {
            console.log('question-updated');
            console.log(this.questions.find(q => q.question.questionMetadata.id === updatedQuestion.questionMetadata.id));
            const lastScore = this.questions.find(q => q.question.questionMetadata.id === updatedQuestion.questionMetadata.id).score;
            const filteredQuestions = this.questions.filter(q => q.question.questionMetadata.id !== updatedQuestion.questionMetadata.id);
            filteredQuestions.push({question: updatedQuestion, score: lastScore, styleClass: lastScore > 0 ? "question-suggested" : "question"});
            this.questions = filteredQuestions;
            if(this.questionInput) {
                await this.handleSuggestions();
            }
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

    async handleSuggestions() {
        const suggestions = await search(this.questionInput);
        const idsAndScore = new Map(suggestions.map((questionWithScore) => {
            const {question, score} = questionWithScore;
            return [question.questionMetadata.id, score];
        }));

        this.questions = this.questions.map(questionWithScoreAndStyle => {
            const questionId = questionWithScoreAndStyle.question.questionMetadata.id;
            if(idsAndScore.get(questionId)) {
                return {question: questionWithScoreAndStyle.question, score: idsAndScore.get(questionId), styleClass: "question-suggested"}
            } else {
                return {question: questionWithScoreAndStyle.question, score: 0, styleClass: "question"};
            }
        });
        console.log('after');
        console.log(this.questions);
    }


    async handleQuestionInputChange(event) {
        event.preventDefault();
        this.questionInput = event.target.value;
        await this.handleSuggestions();
    }

    async onUpdateNickname(event) {
        event.preventDefault();
        try {
            const userInfo = await getUserInfo(this.nickNameInput);
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

            const createdUserInfo = await createUserInfo(this.nickNameInput);
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
    }

    sortQuestions(questions) {
        return questions.sort((a, b) => {
            console.log(a);
            if (a.score > b.score) {
                return -1;
            } else if(a.score < b.score) {
                return 1;
            }
            return a.question.questionMetadata.created > b.question.questionMetadata.created ? -1 : 1;
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
                        ${sorted ? sorted.map((q) =>
                                html`
                                    <question-component .data="${q.question}" .userInfo="${this.userInfo}"
                                                        .styleClass=${q.styleClass}>
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
