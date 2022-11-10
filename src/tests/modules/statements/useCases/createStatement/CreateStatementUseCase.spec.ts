import { OperationType } from "../../../../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../../../../../modules/statements/useCases/createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../../../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { InMemoryUsersRepository } from "../../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let id = '';
describe('Unit Test Create Statement', () => {

    beforeAll(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

        const { id: user_id } = await inMemoryUsersRepository.create({
            name: 'Tyrion Lannister',
            email: 'tyrion@imp.com',
            password: '123456'
        });

        id = user_id as string;
    })


    it('Should be able to create a new deposit', async () => {
        const statement = await createStatementUseCase.execute({
            user_id: id,
            type: OperationType.DEPOSIT,
            amount: 1000,
            description: 'Deposit'
        });

        expect(statement).toHaveProperty('id');
        expect(statement.user_id).toBe(id);
        expect(statement.type).toBe(OperationType.DEPOSIT);
        expect(statement.amount).toBe(1000);
    })

    it('Should be able to create a new withdraw', async () => {
        const statement = await createStatementUseCase.execute({
            user_id: id,
            type: OperationType.DEPOSIT,
            amount: 1000,
            description: 'Deposit'
        });

        expect(statement).toHaveProperty('id');
        expect(statement.user_id).toBe(id);
        expect(statement.type).toBe(OperationType.DEPOSIT);
        expect(statement.amount).toBe(1000);

    });

    it('Should not be able to create a new withdraw with insufficient funds', async () => {
        await expect(createStatementUseCase.execute({
            user_id: id,
            type: OperationType.WITHDRAW,
            amount: 3000,
            description: 'Withdraw'
        })).rejects.toEqual(new CreateStatementError.InsufficientFunds());
    })

    it('Should not be able to create a new withdraw with a non-existing user', async () => {
        await expect(createStatementUseCase.execute({
            user_id: 'non-existing-user',
            type: OperationType.WITHDRAW,
            amount: 3000,
            description: 'Withdraw'
        })).rejects.toEqual(new CreateStatementError.UserNotFound());
    })
})