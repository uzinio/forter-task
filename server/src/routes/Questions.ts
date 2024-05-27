import {Request, Response} from "express";
import {Answer, Question, QuestionMetadata, User} from "../types";
import {ElasticSearchClient} from "../elastic";
import crypto from "crypto";

export const queryQuestions = (elasticSearchClient: ElasticSearchClient) => async (req: Request, res: Response) => {
    const questions: Question[] = await elasticSearchClient.queryQuestions();
    console.log(questions);
    res.send({questions});
};

export const askQuestion = (elasticSearchClient: ElasticSearchClient) => async (req: Request, res: Response) => {
    const {question: inputQuestion}: { question: Question } = req.body;
    const questionObj = Question.clone(inputQuestion);
    const newQuestionMetadata = new QuestionMetadata(crypto.randomUUID(), User.clone(req.body.question.questionMetadata.askedBy))
    questionObj.setQuestionMetadata(newQuestionMetadata);
    console.log(questionObj);
    const question = await elasticSearchClient.askQuestion(Question.clone(questionObj));
    res.send({question});
};

export const answerQuestion = (elasticSearchClient: ElasticSearchClient) => async (req: Request, res: Response) => {
    const {answer}: { answer: Answer } = req.body;
    const answerObj = Answer.clone(answer);
    answerObj.setId(crypto.randomUUID());
    console.log(answerObj);
    const question = await elasticSearchClient.answerQuestion(answerObj);
    res.send({question});
};

export const search = (elasticSearchClient: ElasticSearchClient) => async (req: Request, res: Response) => {
    const {term}: { term: string } = req.body;
    const relatedQuestions: Question[] = await elasticSearchClient.search(term);
    res.send({relatedQuestions});
};
