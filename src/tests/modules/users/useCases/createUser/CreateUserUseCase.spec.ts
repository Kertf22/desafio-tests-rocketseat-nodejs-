import { InMemoryUsersRepository } from "../../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../../../../../modules/users/useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "../../../../../modules/users/useCases/createUser/CreateUserUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;



describe("Unit Test Create User", () => {

    beforeAll(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("Should be able to create a new user", async () => {
        const user = await createUserUseCase.execute({
            name: 'Book',
            email: 'Ant@gmail.com',
            password: '123456'
        });

        expect(user).toHaveProperty('id');
        expect(user.name).toBe('Book');
        expect(user.email).toBe('Ant@gmail.com')
    })

    it("Should not be able to create a user with a used Email ", async () => {
        let created_user = {
            name: 'Dragon',
            email: 'dragon@9balls.com',
            password: '123456'
        };

        await createUserUseCase.execute({
            ...created_user,
        });

        await expect(createUserUseCase.execute({
            ...created_user
        })).rejects.toEqual(new CreateUserError());
    })
})