import {Request, Response} from "express";
import {Answer, Question} from "../types";
import {ElasticSearchClient} from "../elastic";

export const queryQuestions = (elasticSearchClient: ElasticSearchClient) => async (req: Request, res: Response) => {
    const questions: Question[] = await elasticSearchClient.queryQuestions();
    console.log(questions);
    res.send({questions});
};

export const askQuestion = (elasticSearchClient: ElasticSearchClient) => async (req: Request, res: Response) => {
    const {question: inputQuestion}: { question: Question } = req.body;
    console.log(inputQuestion);
    const question = await elasticSearchClient.askQuestion(Question.clone(inputQuestion));
    res.send({question});
};

export const answerQuestion = (elasticSearchClient: ElasticSearchClient) => async (req: Request, res: Response) => {
    const {answer}: { answer: Answer } = req.body;
    console.log(answer);
    res.send({answer});
};

export const search = (elasticSearchClient: ElasticSearchClient) => async (req: Request, res: Response) => {
    const {term}: { term: string } = req.body;
    const relatedQuestions: Question[] = await elasticSearchClient.search(term);
    res.send({relatedQuestions});
};
