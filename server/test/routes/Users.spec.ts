import request from "supertest";
import app, {closeServer} from "../../src";
import {initializeElasticSearchClients} from "../../src/elastic";
import {Fixtures} from "../common";

describe("users route", () => {
    const {usersIndexClient} = initializeElasticSearchClients();

    beforeEach(() => {
        jest.setTimeout(30000);
    });

    afterEach(async () => {
        closeServer();
        setTimeout(() => {}, 3000)
        await usersIndexClient.deleteUserInfo(Fixtures.userInfo.valid.getNickName);
    });

    test("should return 201 when creating a valid user", async () => {
        const res = await request(app).post("/user-info").set('Content-Type', 'application/json').send({user: Fixtures.user.valid});
        expect(res.status).toEqual(201);
    });

    test("should return 200 when trying to get an existing user", async () => {
        await usersIndexClient.addUserInfo(Fixtures.userInfo.valid);
        const res = await request(app).get(`/user-info/${Fixtures.userInfo.valid.getNickName}`);
        expect(res.status).toEqual(200);
    });

    test("should return 404 when trying to get a non existing user", async () => {
        const res = await request(app).get(`/user-info/${Fixtures.userInfo.invalidUserDoesNotExist}`);
        expect(res.status).toEqual(404);
    });

    test("should return 429 when trying to create an already existing user", async () => {
        await usersIndexClient.addUserInfo(Fixtures.userInfo.valid);
        const res = await request(app).post("/user-info").set('Content-Type', 'application/json').send({user: Fixtures.user.valid});
        expect(res.status).toEqual(429);
    });

});
