import {Question, UserInfo} from "../types";
import {ElasticSearchClient} from "./ElasticSearchClient";

const index = 'qna-users-index';

export class UsersIndexClient extends ElasticSearchClient {

    constructor(apiKey: string) {
        super(apiKey);
    }

    public async getUserInfo(nickName: string): Promise<UserInfo> {
        const document = await this.client.get({index, id: nickName});
        return document._source as UserInfo;
    }

    public async addUserInfo(userInfo: UserInfo): Promise<UserInfo> {
        const bulkData = [{index: {_index: index, _id: userInfo.getNickName}}, userInfo];
        const result = await this.client.bulk({
            refresh: true,
            operations: bulkData
        });
        console.log(result.items[0].index);
        return userInfo;
    }
}
