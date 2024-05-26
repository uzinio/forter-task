import express, {Express} from "express";
import dotenv from "dotenv";
import {answerQuestion, askQuestion, queryQuestions} from "./routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(jsonParser);

app.get("/", queryQuestions);
app.post("/ask-question", askQuestion);
app.post("/answer-question", answerQuestion);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
