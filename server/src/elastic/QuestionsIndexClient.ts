import {Client} from "@elastic/elasticsearch";
import {Answer, Question, UserInfo} from "../types";
import {ElasticSearchClient} from "./ElasticSearchClient";

const qnaIndexName = 'qna-index';
const mlPipelineId = 'ml-inference-qna-index-_elser_model_2_linux-x86_64';
const mlModelId = '.elser_model_2_linux-x86_64';
const qnaUsersIndexName = 'qna-users-index';

export class QuestionsIndexClient extends ElasticSearchClient {

    constructor(apiKey: string) {
        super(apiKey);
    }

    public async getQuestion(id: string): Promise<Question> {
        const document = await this.client.get({index: qnaIndexName, id});
        const dbQuestion = document._source;
        return Question.clone(dbQuestion as Question);
    }

    public async queryQuestions(): Promise<Question[]> {
        const searchResult = await this.client.search({index: qnaIndexName});
        return searchResult.hits.hits.map(hit => Question.clone(hit._source as Question));
    }

    public async search(term: string): Promise<Question[]> {
        const searchResults = await this.client.search({
            index: qnaIndexName,
            query: {
                text_expansion: {
                    content: {
                        model_id: mlModelId,
                        model_text: term
                    }
                }
            }
        });
        console.log(searchResults.hits.hits);
        return searchResults.hits.hits.map(hit => Question.clone(hit._source as Question));
    }

    public async askQuestion(question: Question): Promise<Question> {
        const bulkData = [{
            index: {
                _index: qnaIndexName,
                pipeline: mlPipelineId,
                _id: question.getQuestionMetadata.getId
            }
        }, question];
        const result = await this.client.bulk({
            refresh: true,
            operations: bulkData
        });
        console.log(result);
        return question;
    }

    public async answerQuestion(answer: Answer): Promise<Question> {
        const question = await this.getQuestion(answer.getQuestionMetadata.getId);
        console.log(question);
        const newAnswers = question.getAnswers || [];
        newAnswers.push(answer);
        const newQuestion = new Question(question.getQuestionMetadata, question.getContent, newAnswers);
        return await this.askQuestion(newQuestion);
    }

}
