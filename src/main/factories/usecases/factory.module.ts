import { Module } from '@nestjs/common';

import { UserRepository } from '@client-service/infra/orm/repositories';
import { userProvider } from '@client-service/infra/orm/providers';
import {
  createUserFactory,
  findUsersFactory,
  updateUserFactory,
} from '@client-service/main/factories/usecases';
import { KafkaMessageBrokerAdapter } from '@client-service/infra/kafka/adapter';

@Module({
  providers: [
    KafkaMessageBrokerAdapter,

    //repositories
    UserRepository,

    //providers
    userProvider,

    //usecases
    createUserFactory,
    findUsersFactory,
    updateUserFactory,
  ],
  exports: [createUserFactory, findUsersFactory, updateUserFactory],
})
export class FactoryModule {}
