import { Provider } from '@nestjs/common';

import { DELETE_USER_FACTORY } from '@client-service/main/factories/providers';
import { DeleteUserUseCase } from '@client-service/domain/usecases';
import { DeleteUser } from '@client-service/data/usecases';
import { UserRepository } from '@client-service/infra/orm/repositories';
import { KafkaMessageBrokerAdapter } from '@client-service/infra/kafka/adapter';

export const deleteUserFactory: Provider = {
  provide: DELETE_USER_FACTORY,
  useFactory: (
    userRepository: UserRepository,
    kafkaMessageBrokerAdapter: KafkaMessageBrokerAdapter,
  ): DeleteUserUseCase => {
    return new DeleteUser(
      userRepository,
      userRepository,
      kafkaMessageBrokerAdapter,
    );
  },
  inject: [UserRepository, KafkaMessageBrokerAdapter],
};
