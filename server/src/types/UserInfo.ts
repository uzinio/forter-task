import {User} from "./User";

export enum OfferSimilarQuestion {
    NONE = 0,
    AUTO = 1,
    FILTERED = 2
}

export type Preferences = {
    offerSimilarQuestion: OfferSimilarQuestion;
    presentBotAnswers: boolean;
}

const defaultPreferences = {offerSimilarQuestion: OfferSimilarQuestion.NONE, presentBotAnswers: true}

export class UserInfo extends User {
    private readonly preferences: Preferences;

    constructor(nickName: string, firstName?: string, lastName?: string, preferences?: Preferences) {
        super(nickName, firstName, lastName);
        this.preferences = preferences || defaultPreferences;
    }

    get getPreferences() {
        return this.preferences;
    }
}
