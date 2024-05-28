import dotenv from "dotenv";
import {QuestionsIndexClient} from "./QuestionsIndexClient";
import {UsersIndexClient} from "./UsersIndexClient";

export * from './ElasticSearchClient';
export * from './QuestionsIndexClient';
export * from './UsersIndexClient';

export const initializeElasticSearchClients = () => {
    dotenv.config();
    const qnaIndexPrivateKey = process.env.QNA_INDEX_PRIVATE_KEY || '';
    const qnaUsersIndexPrivateKey = process.env.QNA_USERS_INDEX_PRIVATE_KEY || '';
    const questionsIndexClient = new QuestionsIndexClient(qnaIndexPrivateKey);
    const usersIndexClient = new UsersIndexClient(qnaUsersIndexPrivateKey);
    return {questionsIndexClient, usersIndexClient};
}
