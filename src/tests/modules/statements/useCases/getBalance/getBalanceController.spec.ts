import request from "supertest";
import { Connection, createConnection, getConnection } from "typeorm";

import { app } from "../../../../../app";

const user = {
    name: "User Test",
    email: "emailTest",
    password: "passwordTest"
}

let token: string;
let connection: Connection;
describe("Get Balance Controller", () => {

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
    })

    afterAll(async () => {

        await connection.dropDatabase();
        await connection.close()
    });

    it("should be able to get the balance", async () => {

        const response = await request(app).get("/api/v1/statements/balance").set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("balance");
        expect(response.body).toHaveProperty("statement");
    })

    it("should not be able to get the balance of a invalid token", async () => {

        const response = await request(app).get("/api/v1/statements/balance").set({
            Authorization: `Bearer invalid`
        });

        expect(response.status).toBe(401);
    })
})