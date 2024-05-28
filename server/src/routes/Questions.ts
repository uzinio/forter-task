import {Request, Response} from "express";
import {Answer, Question, QuestionMetadata, User, UserInfo} from "../types";
import {QuestionsIndexClient, UsersIndexClient} from "../elastic";
import crypto from "crypto";
import {suggestSimilarQuestionsHandler} from "../elastic/handlers/SuggestSimilarQuestionsHandler";
import {errorHandler} from "../elastic/handlers/ErrorsHandler";

export const queryQuestions = (elasticSearchClient: QuestionsIndexClient) => async (req: Request, res: Response) => {
    const questions: Question[] = await elasticSearchClient.queryQuestions();
    console.log(questions);
    res.send({questions});
};

export const askQuestion = (questionsIndexClient: QuestionsIndexClient, usersIndexClient: UsersIndexClient) => async (req: Request, res: Response) => {
    const {question: inputQuestion}: { question: Question } = req.body;
    const questionObj = Question.clone(inputQuestion);
    let userInfo: UserInfo | undefined = undefined;
    try {
        userInfo = await usersIndexClient.getUserInfo(questionObj.getQuestionMetadata.getAskedBy.getNickName);
    } catch (err: any) {
        return res.send(errorHandler(questionObj, err));
    }
    const newQuestionMetadata = new QuestionMetadata(crypto.randomUUID(), User.clone(req.body.question.questionMetadata.askedBy))
    questionObj.setQuestionMetadata(newQuestionMetadata);
    const question = await questionsIndexClient.askQuestion(Question.clone(questionObj));
    const askQuestionResponse = await suggestSimilarQuestionsHandler(questionsIndexClient)(question, userInfo!);
    res.send({askQuestionResponse});
};

export const answerQuestion = (elasticSearchClient: QuestionsIndexClient) => async (req: Request, res: Response) => {
    const {answer}: { answer: Answer } = req.body;
    const answerObj = Answer.clone(answer);
    answerObj.setId(crypto.randomUUID());
    console.log(answerObj);
    const question = await elasticSearchClient.answerQuestion(answerObj);
    res.send({question});
};

export const search = (elasticSearchClient: QuestionsIndexClient) => async (req: Request, res: Response) => {
    const {term}: { term: string } = req.body;
    const relatedQuestions: Question[] = await elasticSearchClient.search(term);
    res.send({relatedQuestions});
};
