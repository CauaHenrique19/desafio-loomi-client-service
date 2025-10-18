import { Provider } from '@nestjs/common';

import { UPDATE_USER_FACTORY } from '@client-service/main/factories/providers';
import { UpdateUserUseCase } from '@client-service/domain/usecases';
import { UpdateUser } from '@client-service/data/usecases';
import { UserRepository } from '@client-service/infra/orm/repositories';
import { KafkaMessageBrokerAdapter } from '@client-service/infra/kafka/adapter';

export const updateUserFactory: Provider = {
  provide: UPDATE_USER_FACTORY,
  useFactory: (
    userRepository: UserRepository,
    kafkaMessageBrokerAdapter: KafkaMessageBrokerAdapter,
  ): UpdateUserUseCase => {
    return new UpdateUser(
      userRepository,
      userRepository,
      kafkaMessageBrokerAdapter,
    );
  },
  inject: [UserRepository, KafkaMessageBrokerAdapter],
};
