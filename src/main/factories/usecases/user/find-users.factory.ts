import { Provider } from '@nestjs/common';

import { FIND_USERS_FACTORY } from '@client-service/main/factories/providers';
import { UserRepository } from '@client-service/infra/orm/repositories';
import { FindUsersUseCase } from '@client-service/domain/usecases';
import { FindUsers } from '@client-service/data/usecases';

export const findUsersFactory: Provider = {
  provide: FIND_USERS_FACTORY,
  useFactory: (userRepository: UserRepository): FindUsersUseCase => {
    return new FindUsers(userRepository);
  },
  inject: [UserRepository],
};
