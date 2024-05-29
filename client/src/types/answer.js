import {questionMetadataType, userType} from "./";

export const answerType = {
    id: String,
    questionMetadata: questionMetadataType,
    answeredBy: userType,
    content: String
}
