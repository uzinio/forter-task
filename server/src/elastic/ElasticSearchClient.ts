import {Client} from "@elastic/elasticsearch";

const elasticSearchNode = 'https://ac15292a5ea649b9800141d45a3b5700.us-central1.gcp.cloud.es.io:443';

export class ElasticSearchClient {
    protected readonly client: Client;

    constructor(apiKey: string) {
        this.client = new Client({
            node: elasticSearchNode,
            auth: {apiKey}
        });
    }
}
