import {Answer, Question, QuestionMetadata} from "../types";
import {ElasticSearchClient} from "./ElasticSearchClient";

const qnaIndexName = 'qna-index';
const mlPipelineId = 'ml-inference-qna-index-_elser_model_2_linux-x86_64';
const mlModelId = '.elser_model_2_linux-x86_64';

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
        const searchResult = await this.client.search({index: qnaIndexName, size: 100});
        return searchResult.hits.hits.map(hit => Question.clone(hit._source as Question));
    }

    public async search(term: string): Promise<{ question: Question, score: number }[]> {
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
        return searchResults.hits.hits.map(hit => {
            return {question: Question.clone(hit._source as Question), score: hit._score || 0};
        });
    }

    public async askQuestion(question: Question): Promise<Question> {
        const bulkData = [{
            index: {
                _index: qnaIndexName,
                pipeline: mlPipelineId,
                _id: question.getQuestionMetadata.getId
            }
        }, question];
        await this.client.bulk({
            refresh: true,
            operations: bulkData
        });
        return question;
    }

    public async answerQuestion(answer: Answer): Promise<Question> {
        const question = await this.getQuestion(answer.getQuestionMetadata.getId);
        const nowMillisUTC = new Date().valueOf();
        const id = question.getQuestionMetadata.getId;
        const created = question.getQuestionMetadata.getCreated;
        const askedBy = question.getQuestionMetadata.getAskedBy;
        const newQuestionMetadata = new QuestionMetadata(id, created, nowMillisUTC, askedBy);
        question.setQuestionMetadata(newQuestionMetadata);
        answer.setQuestionMetadata(newQuestionMetadata);
        question.getAnswers.push(answer);
        return await this.askQuestion(question);
    }

}
