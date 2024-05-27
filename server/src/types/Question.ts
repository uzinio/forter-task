import {QuestionMetadata} from "./QuestionMetadata";
import {Answer} from "./Answer";

export class Question {

    public static clone(otherQuestion: Question) {
        const otherAnswers = otherQuestion.answers || [];
        return new Question(QuestionMetadata.clone(otherQuestion.questionMetadata), otherQuestion.content, otherAnswers.map(a => Answer.clone(a)));
    }

    private readonly questionMetadata: QuestionMetadata;
    private readonly content: string;
    private readonly answers: Answer[];

    constructor(questionMetadata: QuestionMetadata, content: string, answers: Answer[]) {
        this.questionMetadata = questionMetadata;
        this.content = content;
        this.answers = answers;
    }

    get getQuestionMetadata(): QuestionMetadata {
        return this.questionMetadata;
    }

    get getContent(): string {
        return this.content;
    }

    get getAnswers(): Answer[] {
        return this.answers;
    }
}
