import { FindUsersRepository } from '@client-service/data/protocols/db';
import { FindUsersUseCase } from '@client-service/domain/usecases';

export class FindUsers implements FindUsersUseCase {
  constructor(private readonly findUsersRepository: FindUsersRepository) {}

  async find(
    parameters: FindUsersUseCase.Parameters,
  ): Promise<FindUsersUseCase.Result> {
    return this.findUsersRepository.find(parameters);
  }
}
