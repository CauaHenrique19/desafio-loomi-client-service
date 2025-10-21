import { FindUsersRepository } from '@client-service/data/protocols/db';
import { UserNotFoundError } from '@client-service/domain/errors';
import { FindUsersUseCase } from '@client-service/domain/usecases';

export class FindUsers implements FindUsersUseCase {
  constructor(private readonly findUsersRepository: FindUsersRepository) {}

  async find(
    parameters: FindUsersUseCase.Parameters,
  ): Promise<FindUsersUseCase.Result> {
    const user = await this.findUsersRepository.find(parameters);

    if (!user.length) {
      throw new UserNotFoundError();
    }

    return user;
  }
}
