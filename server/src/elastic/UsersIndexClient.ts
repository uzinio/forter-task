import {ElasticSearchClient} from "./ElasticSearchClient";
import {UserInfo} from "../types";

const index = 'qna-users-index';

export class UsersIndexClient extends ElasticSearchClient {

    constructor(apiKey: string) {
        super(apiKey);
    }

    public async getUserInfo(nickName: string): Promise<UserInfo> {
        const document = await this.client.get({index, id: nickName});
        return UserInfo.clone(document._source as UserInfo);
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

    public async deleteUserInfo(id: string): Promise<boolean> {
        const deleteByQuery = {index, body: {query: {match: {_id: id}}}};
        await this.client.deleteByQuery(deleteByQuery);
        return true;
    }
}
