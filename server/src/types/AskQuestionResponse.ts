import {Question} from "./Question";

export type AskQuestionResponse = {
    question: Question;
    suggestions: Question[];
    errors: string[];
}
