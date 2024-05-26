import {Request, Response} from "express";
import {Answer, Question} from "../types";
import {dummyData} from "./DummyData";

export const queryQuestions = (req: Request, res: Response) => {
    const questions: Question[] = dummyData.questions as Question[];
    console.log(questions);
    res.send({questions});
};

export const askQuestion = (req: Request, res: Response) => {
    const {question}: { question: Question } = req.body;
    console.log(question);
    res.send({question});
};

export const answerQuestion = (req: Request, res: Response) => {
    const {answer}: { answer: Answer } = req.body;
    console.log(answer);
    res.send({answer});
};
