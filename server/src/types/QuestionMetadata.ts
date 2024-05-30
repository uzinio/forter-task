import {User} from "./User";

export class QuestionMetadata {
    private id: string;
    private readonly created: number;
    private updated: number;
    private readonly askedBy: User;

    public static clone(otherQuestionMetadata: QuestionMetadata) {
        return new QuestionMetadata(otherQuestionMetadata.id, otherQuestionMetadata.created, otherQuestionMetadata.updated, User.clone(otherQuestionMetadata.askedBy));
    }

    constructor(id: string, created: number, updated: number, askedBy: User) {
        this.id = id;
        this.created = created;
        this.updated = updated;
        this.askedBy = askedBy;
    }

    get getId(): string {
        return this.id;
    }

    set setId(id: string) {
        this.id = id;
    }

    get getCreated(): number {
        return this.created;
    }

    get getUpdated(): number {
        return this.updated;
    }

    set setUpdated(updated: number) {
        this.updated = updated;
    }

    get getAskedBy(): User {
        return this.askedBy;
    }

}



