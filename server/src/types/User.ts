export class User {
    private readonly nickName: string;
    private readonly firstName?: string;
    private readonly lastName?: string;

    public static clone(otherUser: User) {
        return new User(otherUser.nickName, otherUser.firstName, otherUser.lastName);
    }

    constructor(nickName: string, firstName?: string, lastName?: string) {
        this.nickName = nickName;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    get getNickName(): string {
        return this.nickName;
    }

    get getFirstName(): string | undefined {
        return this.firstName;
    }

    get getLastName(): string | undefined {
        return this.lastName;
    }
}
