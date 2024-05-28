import {OfferSimilarQuestion, Question, QuestionMetadata, User, UserInfo} from "../../src/types";

export const Fixtures = {
    question: {
        valid: new Question(new QuestionMetadata("question-id", new User("testuser")), "question-content", []),
        invalid: new Question(new QuestionMetadata("question-id", new User("non-existing-user")), "question-content", []),
    },
    user: {
        valid: new UserInfo("testuser", "test", "user", {
            offerSimilarQuestion: OfferSimilarQuestion.FILTERED,
            presentBotAnswers: true,
            numberOfQuestionsToOffer: 10
        })
    }
}
