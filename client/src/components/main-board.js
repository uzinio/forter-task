import {LitElement, html} from 'lit';
import style from './styles.css.js';
import {io} from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

/**
 * An example element.
 */
export class MainBoard extends LitElement {
    static get properties() {
        return {
            /**
             * The name to say "Hello" to.
             * @type {string}
             */
            name: {type: String},

            /**
             * The number of times the button has been clicked.
             * @type {number}
             */
            count: {type: Number},
        };
    }

    constructor() {
        super();
        this.name = 'Bot';
        this.count = 0;
        this.socket = io('http://localhost:3000', {
            extraHeaders: {
                "Access-Control-Allow-Origin": "*"
            }
        });
        this.socket.on('new connection', console.log);
    }

    static styles = [style];

    render() {
        const {name, count} = this;
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
                                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                                    <button class="btn btn-outline-success" type="submit">Search</button>
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

                    ${[1,2,3].map((color) =>
                            html`<question-component></question-component>`
                    )}
                    
                    
                </div>
            </main>

            </body>
        `;
    }
}

window.customElements.define('main-board', MainBoard);
