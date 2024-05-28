import {Request, Response} from "express";
import {Answer, Question, QuestionMetadata, RouteException, User, UserInfo} from "../types";
import {QuestionsIndexClient, UsersIndexClient} from "../elastic";
import crypto from "crypto";
import {suggestSimilarQuestionsHandler} from "../elastic/handlers/";

export const queryQuestions = (elasticSearchClient: QuestionsIndexClient) => async (req: Request, res: Response) => {
    const questions: Question[] = await elasticSearchClient.queryQuestions();
    console.log(questions);
    res.send({questions});
};

export const askQuestion = (questionsIndexClient: QuestionsIndexClient, usersIndexClient: UsersIndexClient) => async (req: Request, res: Response) => {
    const {question: inputQuestion}: { question: Question } = req.body;
    const questionObj = Question.clone(inputQuestion);
    const nickName = questionObj.getQuestionMetadata.getAskedBy.getNickName;
    const userInfo = await assertExistsOrThrow<UserInfo>(() => usersIndexClient.getUserInfo(nickName), 'user');
    const newQuestionMetadata = new QuestionMetadata(crypto.randomUUID(), User.clone(req.body.question.questionMetadata.askedBy))
    questionObj.setQuestionMetadata(newQuestionMetadata);
    const question = await questionsIndexClient.askQuestion(Question.clone(questionObj));
    const askQuestionResponse = await suggestSimilarQuestionsHandler(questionsIndexClient)(question, userInfo);
    res.send({askQuestionResponse});
};

export const answerQuestion = (questionsIndexClient: QuestionsIndexClient, usersIndexClient: UsersIndexClient) => async (req: Request, res: Response) => {
    const {answer}: { answer: Answer } = req.body;
    const answerObj = Answer.clone(answer);
    const nickName = answerObj.getAnsweredBy.getNickName;
    await assertExistsOrThrow<UserInfo>(() => usersIndexClient.getUserInfo(nickName), 'user');
    const questionId = answerObj.getQuestionMetadata.getId;
    await assertExistsOrThrow<Question>(() => questionsIndexClient.getQuestion(questionId), 'question');
    answerObj.setId(crypto.randomUUID());
    console.log(answerObj);
    const question = await questionsIndexClient.answerQuestion(answerObj);
    res.send({question});
};

export const search = (elasticSearchClient: QuestionsIndexClient) => async (req: Request, res: Response) => {
    const {term}: { term: string } = req.body;
    const relatedQuestions: Question[] = await elasticSearchClient.search(term);
    res.send({relatedQuestions});
};

async function assertExistsOrThrow<T>(func: () => Promise<T>, entity: string): Promise<T>  {
    try {
        return await func();
    } catch (err: any) {
        throw new RouteException(`${entity} not found`, 404);
    }
}




