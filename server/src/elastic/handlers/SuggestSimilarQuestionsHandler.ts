import {QuestionsIndexClient} from "../QuestionsIndexClient";
import {UsersIndexClient} from "../UsersIndexClient";
import {Answer, OfferSimilarQuestion, Question, User, UserInfo} from "../../types";
import {AskQuestionResponse} from "../../types/AskQuestionResponse";

export const suggestSimilarQuestionsHandler = (questionsIndexClient: QuestionsIndexClient) => async (question: Question, userInfo: UserInfo): Promise<AskQuestionResponse> => {
    switch (userInfo.getPreferences.offerSimilarQuestion) {
        case OfferSimilarQuestion.NONE: {
            return {question, suggestions: [], errors: []};
        }
        case OfferSimilarQuestion.AUTO: {
            const suggestions = await questionsIndexClient.search(question.getContent);
            if (suggestions) {
                const filtered = suggestions.filter(q => q.getQuestionMetadata.getId !== question.getQuestionMetadata.getId);
                if (filtered) {
                    const url = `https://localhost:8000/questions/${filtered[0].getQuestionMetadata.getId}`;
                    await questionsIndexClient.answerQuestion(new Answer("", question.getQuestionMetadata, new User("bot"), `I think this question was already asked here ${url}`))
                }

            }
            return {question, suggestions: [], errors: []};
        }
        case OfferSimilarQuestion.FILTERED: {
            const suggestions = await questionsIndexClient.search(question.getContent);
            const filtered = suggestions.filter(q => q.getQuestionMetadata.getId !== question.getQuestionMetadata.getId);
            return {
                question,
                suggestions: filtered ? filtered.slice(0, userInfo.getPreferences.numberOfQuestionsToOffer) : [],
                errors: []
            };
        }
    }

}
