import {html, LitElement} from 'lit';
import style from './styles.css.js';
import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import {questionType, userInfoType} from "../types/index.js";

export class MainBoard extends LitElement {
    static get properties() {
        return {
            questions: {type: [questionType]},
            gotUpdate: {type: Boolean},
            userInfo: {type: userInfoType},
            nickNameInput: {type: String}
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

        try {
            this.userInfo = JSON.parse(this.getCookie());
        } catch (err) {
            this.userInfo = undefined;
        }

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

    async onSend() {
        try {
            const existingUserResponse = await fetch(`http://localhost:3000/user-info/${this.nickNameInput}`);
            const {userInfo} = await existingUserResponse.json();
            if (userInfo) {
                this.setCookie(userInfo);
                try {
                    this.userInfo = JSON.parse(this.getCookie());
                    this.gotUpdate = true;
                } catch (err) {
                    this.userInfo = undefined;
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
                this.gotUpdate = true;
            } catch (err) {
                this.userInfo = undefined;
            }

        } catch (err) {
            console.error(err);
        }
    }

    render() {
        const {questions} = this || [];
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


            <div class="container my-nav">
                <div class="row">

                    <form class="d-flex" role="search">
                        <div class="col-sm">
                            <input class="form-control" type="search" placeholder="nick name"
                                   aria-label="Search" @input=${this.handleNickNameInputChange}>
                        </div>
                        <div class="col-sm">
                            <button type="button" class="btn btn-success" @click="${this.onSend}">
                                Update
                            </button>
                        </div>
                    </form>

                    <div class="col-lg text-right">
                        ${this.userInfo ? `Hi ${this.userInfo.nickName}` : ''}
                    </div>
                </div>
            </div>


            <main class="container">
                <div class="bg-body-tertiary p-5 rounded">
                    <h1 class="text-center">Forter QnA</h1>
                    <p class="lead text-center">Ask anything, Answer whatever</p>
                    ${questions ? questions.sort(a => 1 - a.created).map((question) =>
                            html`
                                <question-component .data="${question}" .userInfo="${this.userInfo}"></question-component>`
                    ) : html`<h1>Loading...</h1>`}
                </div>
            </main>

            </body>
        `;
    }
}

window.customElements.define('main-board', MainBoard);
