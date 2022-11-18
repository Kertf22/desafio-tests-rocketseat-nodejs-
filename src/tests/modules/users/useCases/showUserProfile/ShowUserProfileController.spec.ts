

import request from "supertest";
import { Connection, createConnection, getConnection } from "typeorm";

import { app } from "../../../../../app";
let connection: Connection;
describe("Show User  Profile Controller", () => {

    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations();
    })

    afterAll(async () => {

        await connection.dropDatabase();
        await connection.close()
    });

    it("Should be able to show a user profile", async () => {
        const response = await request(app).post("/api/v1/users").send({
            name: "User Test",
            email: "emailTest",
            password: "passwordTest"
        })

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "emailTest",
            password: "passwordTest"
        })

        const { token } = responseToken.body;

        const responseProfile = await request(app).get("/api/v1/profile").set({
            params: { id: response.body.id },
            Authorization: `Bearer ${token}`
        })

        expect(responseProfile.status).toBe(200);
        expect(responseProfile.body).toHaveProperty("id");
    });


    it("Should not be able to show a user profile with an invalid token", async () => {
        const responseProfile = await request(app).get("/api/v1/profile").set({
            Authorization: `Bearer any`
        })

        expect(responseProfile.status).toBe(401);
    });

})