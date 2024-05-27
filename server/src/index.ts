import express, {Express} from "express";
import dotenv from "dotenv";
import {answerQuestion, askQuestion, queryQuestions, search} from "./routes";
import {ElasticSearchClient} from "./elastic";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const elasticSearchApiKey = process.env.ELASTIC_SEARCH_PRIVATE_KEY || '';
const elasticSearchClient = new ElasticSearchClient(elasticSearchApiKey);
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(jsonParser);

app.get("/", queryQuestions(elasticSearchClient));
app.post("/ask-question", askQuestion(elasticSearchClient));
app.post("/answer-question", answerQuestion(elasticSearchClient));
app.post("/search", search(elasticSearchClient))

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
