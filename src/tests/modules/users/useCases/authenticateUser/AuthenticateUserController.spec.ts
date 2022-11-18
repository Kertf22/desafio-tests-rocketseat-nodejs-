

import request from "supertest";
import { Connection, createConnection, getConnection } from "typeorm";

import { app } from "../../../../../app";


const user = {
    name: "User Test",
    email: "emailTest",
    password: "passwordTest"
}
let connection: Connection
describe("Authenticate User Controller", () => {

    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations();

        await request(app).post("/api/v1/users").send({
            ...user
        })
    })

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close()
    });

    it("should be able to authenticate an user", async () => {
        const response = await request(app).post("/api/v1/sessions").send({
            email: user.email,
            password: user.password
        })

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");

    })

    it("should not be able to authenticate an nonexistent user", async () => {

        const response = await request(app).post("/api/v1/sessions").send({
            email: "any",
            password: user.password
        })

        expect(response.status).toBe(401);
    })

    it("should not be able to authenticate with incorrect password", async () => {
        const response = await request(app).post("/api/v1/sessions").send({
            email: user.email,
            password: "any"
        })

        expect(response.status).toBe(401);
    })

})