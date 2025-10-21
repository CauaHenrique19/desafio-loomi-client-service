import {
  DeleteUserRepository,
  FindUsersRepository,
} from '@client-service/data/protocols/db';
import { MessageBroker } from '@client-service/data/protocols/message-broker/message-broker';
import { UserNotFoundError } from '@client-service/domain/errors';
import { DeleteUserUseCase } from '@client-service/domain/usecases';

export class DeleteUser implements DeleteUserUseCase {
  constructor(
    private readonly findUsersRepository: FindUsersRepository,
    private readonly deleteUserRepository: DeleteUserRepository,
    private readonly messageBroker: MessageBroker,
  ) {}

  async delete(
    parameters: DeleteUserUseCase.Parameters,
  ): Promise<DeleteUserUseCase.Result> {
    const now = new Date();

    const user = await this.findUsersRepository.find({
      id: parameters.id,
    });

    if (!user.length) {
      throw new UserNotFoundError();
    }

    await this.deleteUserRepository.delete(parameters);
    await this.messageBroker.sendMessage({
      topicName: 'deleted_user',
      message: {
        id: parameters.id,
        deletedAt: now,
      },
    });
  }
}
