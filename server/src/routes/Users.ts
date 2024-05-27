import {Request, Response} from "express";
import {Preferences, User, UserInfo} from "../types";
import {UsersIndexClient} from "../elastic";

export const getUserInfo = (elasticSearchClient: UsersIndexClient) => async (req: Request, res: Response) => {
    const nickName = req.params.nickName;
    const userInfo = await elasticSearchClient.getUserInfo(nickName);
    res.send({userInfo});
};

export const addUserInfo = (elasticSearchClient: UsersIndexClient) => async (req: Request, res: Response) => {
    const {user, preferences}: { user: User, preferences: Preferences } = req.body;
    const userObj = User.clone(user);
    const userInfo = await elasticSearchClient.addUserInfo(new UserInfo(userObj.getNickName, userObj.getFirstName, userObj.getLastName, preferences))
    res.send({userInfo});
};
