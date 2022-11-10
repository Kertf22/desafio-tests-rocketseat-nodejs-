import { InMemoryUsersRepository } from "../../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileError } from "../../../../../modules/users/useCases/showUserProfile/ShowUserProfileError";
import { ShowUserProfileUseCase } from "../../../../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let id = ''
describe("Unit Test Show User profile", () => {

    beforeAll(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

        const user = await createUserUseCase.execute({
            name: 'Monkey D. Luffy',
            email: 'gumogumo@luff.com',
            password:'123456'
        });

        id = user.id as string;
    })

    it("Should be able to show a user profile", async () => {
        const user = await showUserProfileUseCase.execute(id);

        expect(user).toHaveProperty('id');
        expect(user.name).toBe('Monkey D. Luffy');
        expect(user.email).toBe('gumogumo@luff.com');
    });

    it("Should not be able to show a user profile with a non-existing user", async () => {
    
        await expect(showUserProfileUseCase.execute('2')).rejects.toEqual(new ShowUserProfileError());
    });
})