import { Provider } from '@nestjs/common';

import { UPDATE_USER_PICTURE_FACTORY } from '@client-service/main/factories/providers';
import { UpdatePictureUserUseCase } from '@client-service/domain/usecases';
import { UpdateUserPicture } from '@client-service/data/usecases';
import { UserRepository } from '@client-service/infra/orm/repositories';
import { S3FileStorageAdapter } from '@client-service/infra/storage';
import { CryptoAdapter } from '@client-service/infra/encrypt';

export const updateUserPictureFactory: Provider = {
  provide: UPDATE_USER_PICTURE_FACTORY,
  useFactory: (
    userRepository: UserRepository,
    s3FileStorageAdapter: S3FileStorageAdapter,
    cryptoAdapter: CryptoAdapter,
  ): UpdatePictureUserUseCase => {
    return new UpdateUserPicture(
      userRepository,
      cryptoAdapter,
      s3FileStorageAdapter,
      userRepository,
    );
  },
  inject: [UserRepository, S3FileStorageAdapter, CryptoAdapter],
};
