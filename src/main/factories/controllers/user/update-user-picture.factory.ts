import { Inject, Injectable } from '@nestjs/common';

import { Controller } from '@client-service/presentation/protocols';
import { UpdatePictureUserUseCase } from '@client-service/domain/usecases';
import { UPDATE_USER_PICTURE_FACTORY } from '@client-service/main/factories/providers';
import { UpdateUserPictureController } from '@client-service/presentation/controllers';

@Injectable()
export class BuildUpdateUserPictureController {
  constructor(
    @Inject(UPDATE_USER_PICTURE_FACTORY)
    private readonly updatePictureUserUseCase: UpdatePictureUserUseCase,
  ) {}

  public build(): Controller {
    const controller = new UpdateUserPictureController(
      this.updatePictureUserUseCase,
    );
    return controller;
  }
}
