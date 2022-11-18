

import request from "supertest";
import {Connection, createConnection, getConnection } from "typeorm";

import { app } from "../../../../../app";

let connection:Connection;
describe("Create User Controller", () => {
    
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations();
    })

    afterAll(async () => {

        await connection.dropDatabase();
        await connection.close()
    });


    it("should be able to create a new user", async () => {

        const response = await request(app).post("/api/v1/users").send({
            name: "User Test",
            email: "emailTest",
            password: "passwordTest"
        })

        expect(response.status).toBe(201);
    })

    it("should not be able to create a new user with an used email", async () => {
        await request(app).post("/api/v1/users").send({
            name: "User Test",
            email: "emailTest2",
            password: "passwordTest"
        })

        const response = await request(app).post("/api/v1/users").send({
            name: "User Test",
            email: "emailTest2",
            password: "passwordTest"
        })

        expect(response.status).toBe(400);
    })
})