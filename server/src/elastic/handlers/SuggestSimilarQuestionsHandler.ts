import {QuestionsIndexClient} from "../QuestionsIndexClient";
import {UsersIndexClient} from "../UsersIndexClient";
import {Answer, OfferSimilarQuestion, Question, User} from "../../types";
import {AskQuestionResponse} from "../../types/AskQuestionResponse";

export const suggestSimilarQuestionsHandler = (questionsIndexClient: QuestionsIndexClient, usersIndexClient: UsersIndexClient) => async (question: Question): Promise<AskQuestionResponse> => {
    const userInfo = await usersIndexClient.getUserInfo(question.getQuestionMetadata.getAskedBy.getNickName);
    console.log(userInfo);
    switch (userInfo.getPreferences.offerSimilarQuestion) {
        case OfferSimilarQuestion.NONE: {
            return {question, suggestions: []};
        }
        case OfferSimilarQuestion.AUTO: {
            const suggestions = await questionsIndexClient.search(question.getContent);
            if (suggestions) {
                const filtered = suggestions.filter(q => q.getQuestionMetadata.getId !== question.getQuestionMetadata.getId);
                if(filtered) {
                    const url = `https://localhost:8000/questions/${filtered[0].getQuestionMetadata.getId}`;
                    await questionsIndexClient.answerQuestion(new Answer("", question.getQuestionMetadata, new User("bot"), `I think this question was already asked here ${url}`))
                }

            }
            return {question, suggestions: []};
        }
        case OfferSimilarQuestion.FILTERED: {
            const suggestions = await questionsIndexClient.search(question.getContent);
            const filtered = suggestions.filter(q => q.getQuestionMetadata.getId !== question.getQuestionMetadata.getId);
            return {
                question,
                suggestions: filtered ? filtered.slice(0, userInfo.getPreferences.numberOfQuestionsToOffer) : []
            };
        }
    }
}
