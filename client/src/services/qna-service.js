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
    })
};
