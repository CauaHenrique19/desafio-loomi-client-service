import { Inject, Injectable } from '@nestjs/common';
import { FIND_USERS_FACTORY } from '@client-service/main/factories/providers';
import { FindUsersUseCase } from '@client-service/domain/usecases';
import { Controller } from '@client-service/presentation/protocols';
import { FindUsersController } from '@client-service/presentation/controllers';

@Injectable()
export class BuildFindUsersController {
  constructor(
    @Inject(FIND_USERS_FACTORY)
    private readonly findUsers: FindUsersUseCase,
  ) {}

  public build(): Controller {
    const controller = new FindUsersController(this.findUsers);
    return controller;
  }
}
