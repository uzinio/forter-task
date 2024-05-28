import request from "supertest";
import app, {closeServer} from "../../src";
import {initializeElasticSearchClients} from "../../src/elastic";
import {Fixtures} from "../common";


describe("questions route", () => {
    const {usersIndexClient} = initializeElasticSearchClients();

    const givenValidUserExists = async () => {
        await usersIndexClient.addUserInfo(Fixtures.user.valid);
    }

    beforeEach(async () => {
        jest.setTimeout(30000);
        await givenValidUserExists();
    });

    afterEach(async () => {
        closeServer();
        setTimeout(() => {}, 3000);
    });

    test("should return 200 when calling to queryQuestions", async () => {
        const res = await request(app).get("/");

        expect(res.status).toEqual(200);
    });

    test("should return 404 when user that asks question does not exist", async () => {
        const res = await request(app).post("/ask-question").set('Content-Type', 'application/json').send({question: Fixtures.question.invalidUserDoesNotExist});

        expect(res.status).toEqual(404);
    });

    test("should create a question if user exists and input is valid", async () => {
        const res = await request(app).post("/ask-question").set('Content-Type', 'application/json').send({question: Fixtures.question.valid});

        expect(res.status).toEqual(200);
    });
});
