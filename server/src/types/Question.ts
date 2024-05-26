import {User} from "./User";
import {QuestionMetadata} from "./QuestionMetadata";
import {Answer} from "./Answer";

export type Question = {
    questionMetadata: QuestionMetadata;
    content: String;
    answers: Answer[];
}
