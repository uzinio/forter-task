export const getUserInfo = async (nickName) => {
    const response = await fetch(`http://localhost:3000/user-info/${nickName}`);
    const {userInfo} = await response.json();
    return userInfo;
};

export const createUserInfo = async (nickName) => {
    const response = await fetch("http://localhost:3000/user-info", {
        method: "POST",
        body: JSON.stringify({user: {nickName}}),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
    const {userInfo: createdUserInfo} = await response.json();
    return createdUserInfo;
};

export const answerQuestion = async (answer) => {
    await fetch("http://localhost:3000/answer-question", {
        method: "POST",
        body: JSON.stringify({answer}),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
};

export const search = async (term) => {
    const response = await fetch("http://localhost:3000/search", {
        method: "POST",
        body: JSON.stringify({term}),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
    const {relatedQuestions} = await response.json();
    return relatedQuestions;
};

export const askQuestion = async (nickName, content) => {
    const question = {questionMetadata: {askedBy: {nickName}}, content};
    await fetch("http://localhost:3000/ask-question", {
        method: "POST",
        body: JSON.stringify({question}),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    });
}
