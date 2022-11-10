import { InMemoryStatementsRepository } from "../../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetBalanceError } from "../../../../../modules/statements/useCases/getBalance/GetBalanceError";
import { GetBalanceUseCase } from "../../../../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let id = '';
describe('Unit Test Get Balance', () => {

    beforeAll(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);

        const { id: user_id } = await inMemoryUsersRepository.create({
            name: 'Tyrion Lannister',
            email: 'imp@lannister.com',
            password: '123456'
        });

        id = user_id as string;
    })

    it('Should be able to get the balance', async () => {
        await createStatementUseCase.execute({
            user_id: id,
            type: 'deposit' as any,
            amount: 1000,
            description: 'Deposit'
        });

        const balance = await getBalanceUseCase.execute({ user_id: id });

        expect(balance).toHaveProperty('balance');
        expect(balance.balance).toBe(1000);
    })

    it('Should not be able to get the balance of a non-existent user', async () => {
        await expect(getBalanceUseCase.execute({ user_id: 'non-existent-user' })).rejects.toBeInstanceOf(GetBalanceError);
    })
})