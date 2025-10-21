import { Module } from '@nestjs/common';

import { UserRepository } from '@client-service/infra/orm/repositories';
import { userProvider } from '@client-service/infra/orm/providers';
import {
  createUserFactory,
  deleteUserFactory,
  findUsersFactory,
  updateUserFactory,
  updateUserPictureFactory,
} from '@client-service/main/factories/usecases';
import { KafkaMessageBrokerAdapter } from '@client-service/infra/kafka/adapter';
import { S3FileStorageAdapter } from '@client-service/infra/storage';
import { CryptoAdapter } from '@client-service/infra/encrypt';

@Module({
  providers: [
    KafkaMessageBrokerAdapter,
    S3FileStorageAdapter,
    CryptoAdapter,

    //repositories
    UserRepository,

    //providers
    userProvider,

    //usecases
    createUserFactory,
    findUsersFactory,
    updateUserFactory,
    deleteUserFactory,
    updateUserPictureFactory,
  ],
  exports: [
    createUserFactory,
    findUsersFactory,
    updateUserFactory,
    deleteUserFactory,
    updateUserPictureFactory,
  ],
})
export class FactoryModule {}
