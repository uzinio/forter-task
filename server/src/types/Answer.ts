import {User} from "./User";
import {QuestionMetadata} from "./QuestionMetadata";

export class Answer {
    private id: String;
    private questionMetadata: QuestionMetadata;
    private readonly answeredBy: User;
    private readonly content: String;
    private created: number;

    public static clone(otherAnswer: Answer) {
        return new Answer(otherAnswer.id, QuestionMetadata.clone(otherAnswer.questionMetadata), User.clone(otherAnswer.answeredBy), otherAnswer.content, otherAnswer.created);
    }

    constructor(id: String, questionMetadata: QuestionMetadata, answeredBy: User, content: String, created: number) {
        this.id = id;
        this.questionMetadata = questionMetadata;
        this.answeredBy = answeredBy;
        this.content = content;
        this.created = created;
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

    public setId(id: string) {
        this.id = id;
    }

    public setQuestionMetadata(questionMetadata: QuestionMetadata) {
        this.questionMetadata = questionMetadata;
    }

    get getCreated(): number {
        return this.created;
    }

    setCreated(created: number) {
        this.created = created;
    }
}
