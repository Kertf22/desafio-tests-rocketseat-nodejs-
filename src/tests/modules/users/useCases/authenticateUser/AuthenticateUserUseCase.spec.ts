import { InMemoryUsersRepository } from "../../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../../../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../../../../../modules/users/useCases/authenticateUser/IncorrectEmailOrPasswordError";
import { CreateUserUseCase } from "../../../../../modules/users/useCases/createUser/CreateUserUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

let user = {
    name: 'John Snow',
    email: 'john.snow@stark.com',
    password: '123456'
};

describe("Unit Test Authenticate User", () => {

    beforeAll(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

        await createUserUseCase.execute({
            ...user,
        });
    })

    it("Should be able to authenticate user", async () => {

        const { token, user: { id, name, email } } = await authenticateUserUseCase.execute({
            email: 'john.snow@stark.com',
            password: user.password
        })


        expect(token).toBeTruthy();
        expect(id).toBeTruthy();
        expect(name).toBe(user.name);
        expect(email).toBe(user.email);
    })

    it("Should not be able to authenticate user with incorrect email", async () => {
        await expect(authenticateUserUseCase.execute({
            email: 'any',
            password: user.password
        })).rejects.toEqual(new IncorrectEmailOrPasswordError());
    })

    it("Should not be able to authenticate user with incorrect password", async () => {
        await expect(authenticateUserUseCase.execute({
            email: user.email,
            password: 'any'
        })).rejects.toEqual(new IncorrectEmailOrPasswordError());
    })
});

