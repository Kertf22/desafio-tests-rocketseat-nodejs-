import request from "supertest";
import { Connection, createConnection, getConnection } from "typeorm";
import { v4 } from "uuid";
import { app } from "../../../../../app";

const user = {
    name: "User Test",
    email: "emailTest",
    password: "passwordTest"
}
let statement_id: string;
let token: string;
let connection: Connection;
describe("Get Statement Operation Controller", () => {

    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations();

        await request(app).post("/api/v1/users").send({
            ...user
        })

        const response = await request(app).post("/api/v1/sessions").send({
            email: user.email,
            password: user.password
        })

        token = response.body.token;

        const responseDeposit = await request(app).post("/api/v1/statements/deposit").send({
            amount: 100,
            description: "Deposit Test",
            type: "deposit"
        }).set({
            Authorization: `Bearer ${token}`
        });

        statement_id = responseDeposit.body.id;
    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close()
    });


    it("should be able to get a statement operation", async () => {
        const response = await request(app).get(`/api/v1/statements/${statement_id}`).set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("user_id");
        expect(response.body).toHaveProperty("type");
        expect(response.body).toHaveProperty("amount");
        expect(response.body).toHaveProperty("description");

        expect(response.body.id).toEqual(statement_id);
        expect(response.body.type).toBe("deposit");
    })

    it("should not be able to get a statement operation of a non-existent statement", async () => {
        const response = await request(app).get(`/api/v1/statements/${v4()}`).set({
            Authorization: `Bearer ${token}`
        })

        expect(response.status).toBe(404);
    })

    it("should not be able to get a statement operation of a invalid token", async () => {
        const response = await request(app).get(`/api/v1/statements/${statement_id}`).set({
            Authorization: `Bearer invalid`
        })

        expect(response.status).toBe(401);
    })

})