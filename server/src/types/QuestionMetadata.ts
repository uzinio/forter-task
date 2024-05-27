import {User} from "./User";

export class QuestionMetadata {
    private readonly id: string;
    private readonly askedBy: User;

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
}



