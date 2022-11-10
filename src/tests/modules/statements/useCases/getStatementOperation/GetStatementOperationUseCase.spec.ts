import { OperationType } from "../../../../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../../../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../../../../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { GetStatementOperationError } from "../../../../../modules/statements/useCases/getStatementOperation/GetStatementOperationError";
import { GetStatementOperationUseCase } from "../../../../../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let id = ''
let user_id = '';
describe('Unit Test Get Statement Operation', () => {

    beforeAll(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
        const user = await inMemoryUsersRepository.create({
            name: 'Tyrion Lannister',
            email: 'imp@lannister.com',
            password: '123456'
        });

        user_id = user.id as string;

        const { id: statement_id } = await inMemoryStatementsRepository.create({
            user_id,
            type: OperationType.DEPOSIT,
            amount: 1000,
            description: 'Deposit'
        });

        id = statement_id as string;
    })

    it('Should be able to get the statement operation', async () => {
        const statementOperation = await getStatementOperationUseCase.execute({ user_id, statement_id: id })

        expect(statementOperation).toHaveProperty("id");
        expect(statementOperation.id).toBe(id);
        expect(statementOperation.user_id).toBe(user_id);
    })

    it('Should not be able to get the statement operation of a non-existent user', async () => {
        await expect(getStatementOperationUseCase.execute({ user_id: 'any', statement_id: id }))
            .rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    })


    it('Should not be able to get an  non-existent statement operation', async () => {
        await expect(getStatementOperationUseCase.execute({ user_id, statement_id: 'any' }))
            .rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);

    })
})