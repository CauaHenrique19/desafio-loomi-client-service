import { Inject, Injectable } from '@nestjs/common';

import { Controller } from '@client-service/presentation/protocols';
import { UpdateUserUseCase } from '@client-service/domain/usecases';
import { UPDATE_USER_FACTORY } from '@client-service/main/factories/providers';
import { UpdateUserController } from '@client-service/presentation/controllers';

@Injectable()
export class BuildUpdateUserController {
  constructor(
    @Inject(UPDATE_USER_FACTORY)
    private readonly updateUser: UpdateUserUseCase,
  ) {}

  public build(): Controller {
    const controller = new UpdateUserController(this.updateUser);
    return controller;
  }
}
