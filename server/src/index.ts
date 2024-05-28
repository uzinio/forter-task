import express, {Express} from "express";
import dotenv from "dotenv";
import {addUserInfo, answerQuestion, askQuestion, getUserInfo, queryQuestions, search, updateUserInfo} from "./routes";
import {errorHandlingMiddleware} from "./middleware";
import "express-async-errors";
import {initializeElasticSearchClients} from "./elastic";

dotenv.config();

const app: Express = express();
const port = (process.env.NODE_ENV === 'test' ? process.env.TEST_PORT : process.env.PORT) || 3000;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(jsonParser);

const {questionsIndexClient, usersIndexClient} = initializeElasticSearchClients();

app.get("/", queryQuestions(questionsIndexClient));
app.post("/ask-question", askQuestion(questionsIndexClient, usersIndexClient));
app.post("/answer-question", answerQuestion(questionsIndexClient, usersIndexClient));
app.post("/search", search(questionsIndexClient));

app.get("/user-info/:nickName", getUserInfo(usersIndexClient));
app.post("/user-info", addUserInfo(usersIndexClient));
app.patch("/user-info", updateUserInfo(usersIndexClient));

app.use(errorHandlingMiddleware);

const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

export const closeServer = () => {
    console.log('Closing server')
    server.close();
}

export default app;
