import {User} from "./User";

export enum OfferSimilarQuestion {
    NONE = 0,
    AUTO = 1,
    FILTERED = 2
}

export type Preferences = {
    offerSimilarQuestion: OfferSimilarQuestion;
    presentBotAnswers: boolean;
    numberOfQuestionsToOffer: number;
}

const defaultPreferences = {
    offerSimilarQuestion: OfferSimilarQuestion.NONE,
    presentBotAnswers: true,
    numberOfQuestionsToOffer: 0
}

export class UserInfo extends User {
    private readonly preferences: Preferences;

    public static clone(otherUserInfo: UserInfo) {
        return new UserInfo(otherUserInfo.nickName, otherUserInfo.firstName, otherUserInfo.lastName, otherUserInfo.preferences);
    }

    constructor(nickName: string, firstName?: string, lastName?: string, preferences?: Preferences) {
        super(nickName, firstName, lastName);
        this.preferences = preferences || defaultPreferences;
    }

    get getPreferences() {
        return this.preferences;
    }
}
