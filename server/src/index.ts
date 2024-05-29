import express, {Express} from "express";
import httpServer from 'http';
import dotenv from "dotenv";
import {addUserInfo, answerQuestion, askQuestion, getUserInfo, queryQuestions, search, updateUserInfo} from "./routes";
import {errorHandlingMiddleware} from "./middleware";
import "express-async-errors";
import {initializeElasticSearchClients} from "./elastic";

const cors = require('cors');
import {Server} from 'socket.io';

dotenv.config();

const port = (process.env.NODE_ENV === 'test' ? process.env.TEST_PORT : process.env.PORT) || 3000;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();

app.use(jsonParser);
app.use(cors());
const http = httpServer.createServer(app);

const server = http.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

const io = new Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const {questionsIndexClient, usersIndexClient} = initializeElasticSearchClients();

app.get("/", queryQuestions(questionsIndexClient));
app.post("/ask-question", askQuestion(questionsIndexClient, usersIndexClient));
app.post("/answer-question", answerQuestion(questionsIndexClient, usersIndexClient));
app.post("/search", search(questionsIndexClient));

app.get("/user-info/:nickName", getUserInfo(usersIndexClient));
app.post("/user-info", addUserInfo(usersIndexClient));
app.patch("/user-info", updateUserInfo(usersIndexClient));

app.use(errorHandlingMiddleware);

export const closeServer = () => {
    console.log('Closing server')
    server.close();
}

io.on('connection', async (socket) => {
    console.log('new connection');
    const questions = await questionsIndexClient.queryQuestions();
    io.emit('new connection', {questions});
});

export default app;
