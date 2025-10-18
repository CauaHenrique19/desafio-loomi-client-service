import {
  BuildCreateUserController,
  BuildFindUsersController,
  BuildUpdateUserController,
  BuildDeleteUserController,
} from '@client-service/main/factories/controllers';
import { FactoryModule } from '@client-service/main/factories/usecases/factory.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  imports: [FactoryModule],
  controllers: [UserController],
  providers: [
    BuildCreateUserController,
    BuildFindUsersController,
    BuildUpdateUserController,
    BuildDeleteUserController,
  ],
})
export class UserModule {}
