import { UserNotFoundError } from '@client-service/domain/errors';
import { UpdateUserUseCase } from '@client-service/domain/usecases';
import {
  notFound,
  ok,
  serverError,
} from '@client-service/presentation/helpers/http-helper';
import {
  Controller,
  HttpResponse,
} from '@client-service/presentation/protocols';

export class UpdateUserController implements Controller {
  constructor(private readonly updateUser: UpdateUserUseCase) {}

  async handle(
    request: UpdateUserController.Parameters,
  ): Promise<HttpResponse> {
    try {
      const updatedUser = await this.updateUser.update(request);
      return ok(updatedUser);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound(error);
      }

      return serverError(error);
    }
  }
}

export namespace UpdateUserController {
  export type Parameters = UpdateUserUseCase.Parameters;
}
