import crypto from "crypto";
import {QuestionsIndexClient} from "../elastic";
import {Answer, OfferSimilarQuestion, Question, User, UserInfo} from "../types";

export const suggestSimilarQuestionsHandler = (questionsIndexClient: QuestionsIndexClient) => async (question: Question, userInfo: UserInfo): Promise<Question> => {
    const filterById = (questionWithScore: { question: Question, score: number }) => questionWithScore.question.getQuestionMetadata.getId !== question.getQuestionMetadata.getId;
    switch (userInfo.getPreferences.offerSimilarQuestion) {
        case OfferSimilarQuestion.AUTO: {
            const suggestions = (await questionsIndexClient.search(question.getContent)).filter(filterById);
            if (suggestions) {
                const sorted = suggestions.sort((a, b) => {
                    if (a.score > b.score) {
                        return -1;
                    } else if (a.score < b.score) {
                        return 1;
                    }
                    return a.question.getQuestionMetadata.getCreated > b.question.getQuestionMetadata.getCreated ? -1 : 1;
                });
                const nowMillisUTC = new Date().valueOf();
                const content = `I think this question looks similar: ${sorted[0].question.getContent.slice(0, 40)}...`;
                return await questionsIndexClient.answerQuestion(new Answer(crypto.randomUUID(), question.getQuestionMetadata, new User("forter-bot"), content, nowMillisUTC));
            }
        }
        case OfferSimilarQuestion.NONE:
        case OfferSimilarQuestion.FILTERED:
        default:
            return question;
    }
}
