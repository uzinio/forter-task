import {User} from "./User";
import {QuestionMetadata} from "./QuestionMetadata";

export class Answer {
    private readonly id: String;
    private readonly questionMetadata: QuestionMetadata;
    private readonly answeredBy: User;
    private readonly content: String;

    public static clone(otherAnswer: Answer) {
        return new Answer(otherAnswer.id, otherAnswer.questionMetadata, otherAnswer.answeredBy, otherAnswer.content)
    }

    constructor(id: String, questionMetadata: QuestionMetadata, answeredBy: User, content: String) {
        this.id = id;
        this.questionMetadata = questionMetadata;
        this.answeredBy = answeredBy;
        this.content = content;
    }

    get getId(): String {
        return this.id;
    }

    get getQuestionMetadata(): QuestionMetadata {
        return this.questionMetadata;
    }

    get getAnsweredBy(): User {
        return this.answeredBy;
    }

    get getContent(): String {
        return this.content;
    }
}
