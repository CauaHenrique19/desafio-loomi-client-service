import {
  UpdateUserRepository,
  FindUsersRepository,
} from '@client-service/data/protocols/db';
import { MessageBroker } from '@client-service/data/protocols/message-broker/message-broker';
import { UserNotFoundError } from '@client-service/domain/errors';
import { UpdateUserUseCase } from '@client-service/domain/usecases';

export class UpdateUser implements UpdateUserUseCase {
  constructor(
    private readonly findUsersRepository: FindUsersRepository,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly messageBroker: MessageBroker,
  ) {}

  async update(
    parameters: UpdateUserUseCase.Parameters,
  ): Promise<UpdateUserUseCase.Result> {
    const user = await this.findUsersRepository.find({
      id: parameters.id,
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    const updatedUser = await this.updateUserRepository.update(parameters);

    await this.messageBroker.sendMessage({
      topicName: 'updated_user',
      message: updatedUser,
    });

    return updatedUser;
  }
}
