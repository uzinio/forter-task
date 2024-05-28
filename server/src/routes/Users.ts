import {Request, Response} from "express";
import {Preferences, RouteException, User, UserInfo} from "../types";
import {UsersIndexClient} from "../elastic";
import {throwIfExists, throwIfNotExists} from "./Common";

export const getUserInfo = (elasticSearchClient: UsersIndexClient) => async (req: Request, res: Response) => {
    const nickName = req.params.nickName;
    const userInfo = await throwIfNotExists<UserInfo>(() => elasticSearchClient.getUserInfo(nickName), 'user');
    res.send({userInfo});
};

export const addUserInfo = (elasticSearchClient: UsersIndexClient) => async (req: Request, res: Response) => {
    const {user, preferences}: { user: User, preferences: Preferences } = req.body;
    const userObj = User.clone(user);
    const nickName = userObj.getNickName;
    await throwIfExists<UserInfo>(() => elasticSearchClient.getUserInfo(nickName), 'user');
    const userInfo = await elasticSearchClient.addUserInfo(new UserInfo(userObj.getNickName, userObj.getFirstName, userObj.getLastName, preferences))
    res.status(201).send({userInfo});
};

export const updateUserInfo = (elasticSearchClient: UsersIndexClient) => async (req: Request, res: Response) => {
    const {user, preferences}: { user: User, preferences: Preferences } = req.body;
    const userObj = User.clone(user);
    const nickName = userObj.getNickName;
    await throwIfNotExists<UserInfo>(() => elasticSearchClient.getUserInfo(nickName), 'user');
    const userInfo = await elasticSearchClient.addUserInfo(new UserInfo(userObj.getNickName, userObj.getFirstName, userObj.getLastName, preferences))
    res.send({userInfo});
};
