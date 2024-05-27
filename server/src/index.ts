import express, {Express} from "express";
import dotenv from "dotenv";
import {addUserInfo, answerQuestion, askQuestion, getUserInfo, queryQuestions, search} from "./routes";
import {QuestionsIndexClient, UsersIndexClient} from "./elastic";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const qnaIndexPrivateKey = process.env.QNA_INDEX_PRIVATE_KEY || '';
const qnaUsersIndexPrivateKey = process.env.QNA_USERS_INDEX_PRIVATE_KEY || '';
const qnaIndexClient = new QuestionsIndexClient(qnaIndexPrivateKey);
const qnaUsersIndexClient = new UsersIndexClient(qnaUsersIndexPrivateKey);
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(jsonParser);

app.get("/", queryQuestions(qnaIndexClient));
app.post("/ask-question", askQuestion(qnaIndexClient));
app.post("/answer-question", answerQuestion(qnaIndexClient));
app.post("/search", search(qnaIndexClient))
app.get("/user-info/:nickName", getUserInfo(qnaUsersIndexClient))
app.post("/user-info", addUserInfo(qnaUsersIndexClient))

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
