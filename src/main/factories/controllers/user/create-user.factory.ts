import { Inject, Injectable } from '@nestjs/common';

import { Controller } from '@client-service/presentation/protocols';
import { CreateUserUseCase } from '@client-service/domain/usecases';
import { CREATE_USER_FACTORY } from '@client-service/main/factories/providers';
import { CreateUserController } from '@client-service/presentation/controllers';

@Injectable()
export class BuildCreateUserController {
  constructor(
    @Inject(CREATE_USER_FACTORY)
    private readonly createUser: CreateUserUseCase,
  ) {}

  public build(): Controller {
    const controller = new CreateUserController(this.createUser);
    return controller;
  }
}
