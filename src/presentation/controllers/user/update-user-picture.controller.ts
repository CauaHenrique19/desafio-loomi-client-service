import { UserNotFoundError } from '@client-service/domain/errors';
import { UpdatePictureUserUseCase } from '@client-service/domain/usecases';
import {
  notFound,
  ok,
  serverError,
} from '@client-service/presentation/helpers/http-helper';
import {
  Controller,
  HttpResponse,
} from '@client-service/presentation/protocols';

export class UpdateUserPictureController implements Controller {
  constructor(
    private readonly updatePictureUserUseCase: UpdatePictureUserUseCase,
  ) {}

  async handle(
    request: UpdateUserPictureController.Parameters,
  ): Promise<HttpResponse> {
    try {
      const updatedUser = await this.updatePictureUserUseCase.update(request);
      return ok(updatedUser);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound(error);
      }

      return serverError(error);
    }
  }
}

export namespace UpdateUserPictureController {
  export type Parameters = UpdatePictureUserUseCase.Parameters;
}
