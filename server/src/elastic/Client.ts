import {Client} from "@elastic/elasticsearch";
import {Answer, Question} from "../types";

const node = 'https://ac15292a5ea649b9800141d45a3b5700.us-central1.gcp.cloud.es.io:443';
const index = 'qna-index';
const pipeline = 'ml-inference-qna-index-_elser_model_2_linux-x86_64';
const modelId = '.elser_model_2_linux-x86_64'

export class ElasticSearchClient {
    private readonly client: Client;

    constructor(apiKey: string) {
        this.client = new Client({
            node,
            auth: {apiKey}
        });
    }

    public async getQuestion(id: string): Promise<Question> {
        console.log(index);
        console.log(id);
        const document = await this.client.get({index, id});
        const dbQuestion = document._source;
        return Question.clone(dbQuestion as Question);
    }

    public async queryQuestions(): Promise<Question[]> {
        const searchResult = await this.client.search({index});
        return searchResult.hits.hits.map(hit => Question.clone(hit._source as Question));
    }

    public async search(term: string): Promise<Question[]> {
        const searchResults = await this.client.search({
            index,
            query: {
                text_expansion: {
                    content: {
                        model_id: modelId,
                        model_text: term
                    }
                }
            }
        });
        console.log(searchResults.hits.hits);
        return searchResults.hits.hits.map(hit => Question.clone(hit._source as Question));
    }

    public async askQuestion(question: Question): Promise<Question> {
        const bulkData = [{index: {_index: index, pipeline, _id: question.getQuestionMetadata.getId}}, question];
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
