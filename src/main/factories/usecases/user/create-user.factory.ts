import { Provider } from '@nestjs/common';

import { CREATE_USER_FACTORY } from '@client-service/main/factories/providers';
import { CreateUserUseCase } from '@client-service/domain/usecases';
import { CreateUser } from '@client-service/data/usecases';
import { UserRepository } from '@client-service/infra/orm/repositories';
import { KafkaMessageBrokerAdapter } from '@client-service/infra/kafka/adapter';

export const createUserFactory: Provider = {
  provide: CREATE_USER_FACTORY,
  useFactory: (
    userRepository: UserRepository,
    kafkaMessageBrokerAdapter: KafkaMessageBrokerAdapter,
  ): CreateUserUseCase => {
    return new CreateUser(
      userRepository,
      userRepository,
      kafkaMessageBrokerAdapter,
    );
  },
  inject: [UserRepository, KafkaMessageBrokerAdapter],
};
