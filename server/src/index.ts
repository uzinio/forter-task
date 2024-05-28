import express, {Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import {addUserInfo, answerQuestion, askQuestion, getUserInfo, queryQuestions, search} from "./routes";
import {QuestionsIndexClient, UsersIndexClient} from "./elastic";
import {errorHandlingMiddleware} from "./middleware";
import "express-async-errors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const qnaIndexPrivateKey = process.env.QNA_INDEX_PRIVATE_KEY || '';
const qnaUsersIndexPrivateKey = process.env.QNA_USERS_INDEX_PRIVATE_KEY || '';
const questionsIndexClient = new QuestionsIndexClient(qnaIndexPrivateKey);
const usersIndexClient = new UsersIndexClient(qnaUsersIndexPrivateKey);
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(jsonParser);

app.get("/", queryQuestions(questionsIndexClient));
app.post("/ask-question", askQuestion(questionsIndexClient, usersIndexClient));
app.post("/answer-question", answerQuestion(questionsIndexClient, usersIndexClient));
app.post("/search", search(questionsIndexClient));

app.get("/user-info/:nickName", getUserInfo(usersIndexClient));
app.post("/user-info", addUserInfo(usersIndexClient));

app.use(errorHandlingMiddleware);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
