import {User} from "./User";
import {QuestionMetadata} from "./QuestionMetadata";

export type Answer = {
    id: String;
    questionMetadata: QuestionMetadata;
    answeredBy: User;
    content: String;
}
