import {AskQuestionResponse} from "../../types/AskQuestionResponse";
import {Question} from "../../types";

export const errorHandler = (question: Question, err: any) : AskQuestionResponse => {
    const errorMessage = (err?.meta?.statusCode && err?.meta?.statusCode === 404) ? `user with nickName ${question.getQuestionMetadata.getAskedBy.getNickName} not found` : err.message;
    return {
        question,
        suggestions: [],
        errors: [errorMessage],
    }
}
