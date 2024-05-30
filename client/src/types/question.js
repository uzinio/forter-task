import {answerType, questionMetadataType} from "./";

export const questionType = {
    questionMetadata: questionMetadataType,
    content: String,
    answers: [answerType],
    score: String,
    styleClass: String
}
