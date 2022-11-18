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
describe("Create Statement Controller", () => {

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

    it("should be able to create a new deposit statement", async () => {

        const response = await request(app).post("/api/v1/statements/deposit").send({
            amount: 100,
            description: "Deposit Test",
            type: "deposit"
        }).set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("amount");
    })

    it("should be able to create a new withdraw statement", async () => {
        const response = await request(app).post("/api/v1/statements/deposit").send({
            amount: 100,
            description: "Deposit Test",
            type: "deposit"
        }).set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("amount");
        expect(response.body.type).toBe("deposit");


        const responseWithDraw = await request(app).post("/api/v1/statements/withdraw").send({
            amount: 100.00,
            description: "Deposit Test",
        }).set({
            Authorization: `Bearer ${token}`
        });

        expect(responseWithDraw.status).toBe(201);
        expect(responseWithDraw.body).toHaveProperty("id");
        expect(responseWithDraw.body).toHaveProperty("amount");
        expect(responseWithDraw.body.type).toBe("withdraw");
    })

    it("should not be able to create a new withdraw statement without funds", async () => {
        const response = await request(app).post("/api/v1/statements/withdraw").send({
            amount: 1000,
            description: "Deposit Test",
        }).set({
            Authorization: `Bearer ${token}`
        });

        console.log(response.text)
        expect(response.status).toBe(400);
    })

    it("should not be able to create a new statement with an invalid token", async () => {
        const response = await request(app).post("/api/v1/statements/deposit").send({
            amount: 100,
            description: "Deposit Test",
            type: "deposit"
        }).set({
            Authorization: `Bearer any`
        })

        expect(response.status).toBe(401);
    })



})