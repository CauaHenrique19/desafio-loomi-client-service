import { Inject, Injectable } from '@nestjs/common';

import { Controller } from '@client-service/presentation/protocols';
import { DeleteUserUseCase } from '@client-service/domain/usecases';
import { DELETE_USER_FACTORY } from '@client-service/main/factories/providers';
import { DeleteUserController } from '@client-service/presentation/controllers';

@Injectable()
export class BuildDeleteUserController {
  constructor(
    @Inject(DELETE_USER_FACTORY)
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  public build(): Controller {
    const controller = new DeleteUserController(this.deleteUser);
    return controller;
  }
}
