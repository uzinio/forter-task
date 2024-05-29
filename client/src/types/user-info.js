export const offerSimilarQuestionEnum = {
    "FILTERED": 0,
    "NONE": 1,
    "AUTO": 2
}

export const defaultPreferences = {
    offerSimilarQuestion: offerSimilarQuestionEnum.FILTERED,
    presentBotAnswers: true,
    numberOfQuestionsToOffer: 10
}

export const preferncesType = {
    offerSimilarQuestion: String,
    presentBotAnswers: Boolean,
    numberOfQuestionsToOffer: Number
}

export const userInfoType = {
    nickName: String,
    firstName: String,
    lastName: String,
    preferences: preferncesType,
}
