import {Request, Response} from "express";
import {Answer, Question, QuestionMetadata, RouteException, User, UserInfo} from "../types";
import {QuestionsIndexClient, UsersIndexClient} from "../elastic";
import crypto from "crypto";
import {suggestSimilarQuestionsHandler} from "../elastic/handlers/";
import {throwIfNotExists} from "./Common";
import {Server} from "socket.io";

export const queryQuestions = (elasticSearchClient: QuestionsIndexClient) => async (req: Request, res: Response) => {
    const questions: Question[] = await elasticSearchClient.queryQuestions();
    // console.log(questions);
    res.send({questions});
};

export const askQuestion = (questionsIndexClient: QuestionsIndexClient, usersIndexClient: UsersIndexClient, io: Server) => async (req: Request, res: Response) => {
    const {question: inputQuestion}: { question: Question } = req.body;
    const questionObj = Question.clone(inputQuestion);
    const nickName = questionObj.getQuestionMetadata.getAskedBy.getNickName;
    const userInfo = await throwIfNotExists<UserInfo>(() => usersIndexClient.getUserInfo(nickName), 'user');
    const nowMillisUTC = new Date().valueOf();
    const newQuestionMetadata = new QuestionMetadata(crypto.randomUUID(), nowMillisUTC, nowMillisUTC, User.clone(req.body.question.questionMetadata.askedBy))
    questionObj.setQuestionMetadata(newQuestionMetadata);
    const question = await questionsIndexClient.askQuestion(Question.clone(questionObj));
    const askQuestionResponse = await suggestSimilarQuestionsHandler(questionsIndexClient)(question, userInfo);
    io.emit('question-created', {...question} as any);
    res.send({askQuestionResponse});
};

export const answerQuestion = (questionsIndexClient: QuestionsIndexClient, usersIndexClient: UsersIndexClient, io: Server) => async (req: Request, res: Response) => {
    const {answer}: { answer: Answer } = req.body;
    const answerObj = Answer.clone(answer);
    const nickName = answerObj.getAnsweredBy.getNickName;
    await throwIfNotExists<UserInfo>(() => usersIndexClient.getUserInfo(nickName), 'user');
    const questionId = answerObj.getQuestionMetadata.getId;
    await throwIfNotExists<Question>(() => questionsIndexClient.getQuestion(questionId), 'question');
    answerObj.setId(crypto.randomUUID());
    const nowMillisUTC = new Date().valueOf();
    answerObj.setCreated(nowMillisUTC);
    const question = await questionsIndexClient.answerQuestion(answerObj);
    io.emit('question-updated', {...question} as any);
    res.send({question});
};

export const search = (elasticSearchClient: QuestionsIndexClient) => async (req: Request, res: Response) => {
    const {term}: { term: string } = req.body;
    const relatedQuestions: Question[] = await elasticSearchClient.search(term);
    res.send({relatedQuestions});
};




