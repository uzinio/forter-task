import {User} from "./User";

export class QuestionMetadata {
    private id: string;
    private readonly askedBy: User;

    public static clone(otherQuestionMetadata: QuestionMetadata) {
        console.log(otherQuestionMetadata);
        return new QuestionMetadata(otherQuestionMetadata.id, User.clone(otherQuestionMetadata.askedBy));
    }

    constructor(id: string, askedBy: User) {
        this.id = id;
        this.askedBy = askedBy;
    }

    get getId(): string {
        return this.id;
    }

    get getAskedBy(): User {
        return this.askedBy;
    }

    set setId(id: string) {
        this.id = id;
    }
}



