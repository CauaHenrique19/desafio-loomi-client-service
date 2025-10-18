import {
  CreateUserRepository,
  FindUserRepository,
} from '@client-service/data/protocols/db';
import { MessageBroker } from '@client-service/data/protocols/message-broker/message-broker';
import { StatusEnum } from '@client-service/domain/enums';
import { UserAlreadyExists } from '@client-service/domain/errors';
import { CreateUserUseCase } from '@client-service/domain/usecases';

export class CreateUser implements CreateUserUseCase {
  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly createUserRepository: CreateUserRepository,
    private readonly messageBroker: MessageBroker,
  ) {}

  async create(
    parameters: CreateUserUseCase.Parameters,
  ): Promise<CreateUserUseCase.Result> {
    const now = new Date();

    const user = await this.findUserRepository.findOne({
      email: parameters.email,
    });

    if (user) {
      throw new UserAlreadyExists();
    }

    const createdUser = await this.createUserRepository.create({
      ...parameters,
      status: StatusEnum.ACTIVE,
      createdAt: now,
    });

    await this.messageBroker.sendMessage({
      topicName: 'created_user',
      message: createdUser,
    });

    return createdUser;
  }
}
