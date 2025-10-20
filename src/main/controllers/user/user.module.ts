import {
  BuildCreateUserController,
  BuildFindUsersController,
  BuildUpdateUserController,
  BuildDeleteUserController,
  BuildUpdateUserPictureController,
} from '@client-service/main/factories/controllers';
import { FactoryModule } from '@client-service/main/factories/usecases/factory.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  imports: [FactoryModule],
  controllers: [UserController],
  providers: [
    {
      provide: BuildCreateUserController.name,
      useClass: BuildCreateUserController,
    },
    {
      provide: BuildFindUsersController.name,
      useClass: BuildFindUsersController,
    },
    {
      provide: BuildUpdateUserController.name,
      useClass: BuildUpdateUserController,
    },
    {
      provide: BuildDeleteUserController.name,
      useClass: BuildDeleteUserController,
    },
    {
      provide: BuildUpdateUserPictureController.name,
      useClass: BuildUpdateUserPictureController,
    },
  ],
})
export class UserModule {}
