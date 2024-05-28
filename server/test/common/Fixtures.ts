import {defaultPreferences, OfferSimilarQuestion, Question, QuestionMetadata, User, UserInfo} from "../../src/types";


const nickName = "testuser"
const firstName = "test"
const lastName = "user"
const questionId = "question-id"
const content = "question-content"
const nonExistingUserNickName = "non-existing-user-nickName"

export const Fixtures = {
    question: {
        valid: new Question(new QuestionMetadata(questionId, new User(nickName)), content, []),
        invalidUserDoesNotExist: new Question(new QuestionMetadata(questionId, new User(nonExistingUserNickName)), content, []),
        invalidMessageDoesNotExist: new Question(new QuestionMetadata("non-existing-question-id", new User(nickName)), content, []),
    },
    user: {
        valid: new UserInfo(nickName, firstName, lastName, defaultPreferences)
    },
    userInfo: {
        valid: new UserInfo(nickName, firstName, lastName, defaultPreferences),
        invalidUserDoesNotExist: new UserInfo(nonExistingUserNickName, firstName, lastName, defaultPreferences),
    }
}
