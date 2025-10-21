import { Provider } from '@nestjs/common';

import { User } from '@client-service/infra/orm/entities';
import { USER_REPOSITORY } from '@client-service/infra/orm/typeorm/typeorm.repositories';

export const userProvider: Provider = {
  provide: USER_REPOSITORY,
  useValue: User,
};
