import {QuestionsIndexClient} from "../QuestionsIndexClient";
import {Answer, AskQuestionResponse, OfferSimilarQuestion, Question, User, UserInfo} from "../../types";
import crypto from "crypto";

export const suggestSimilarQuestionsHandler = (questionsIndexClient: QuestionsIndexClient) => async (question: Question, userInfo: UserInfo): Promise<AskQuestionResponse> => {
    const filterById = (_question: Question) => _question.getQuestionMetadata.getId !== question.getQuestionMetadata.getId;
    switch (userInfo.getPreferences.offerSimilarQuestion) {
        case OfferSimilarQuestion.NONE: {
            return {question, suggestions: [], errors: []};
        }
        case OfferSimilarQuestion.AUTO: {
            const suggestions = await questionsIndexClient.search(question.getContent);
            if (suggestions) {
                const filtered = suggestions.filter(filterById);
                if (filtered) {
                    const url = `https://localhost:8000/questions/${filtered[0].getQuestionMetadata.getId}`;
                    await questionsIndexClient.answerQuestion(new Answer(crypto.randomUUID(), question.getQuestionMetadata, new User("bot"), `I think this question was already asked here ${url}`))
                }

            }
            return {question, suggestions: [], errors: []};
        }
        case OfferSimilarQuestion.FILTERED: {
            const suggestions = await questionsIndexClient.search(question.getContent);
            const filtered = suggestions.filter(filterById);
            return {
                question,
                suggestions: filtered ? filtered.slice(0, userInfo.getPreferences.numberOfQuestionsToOffer) : [],
                errors: []
            };
        }
    }
}
