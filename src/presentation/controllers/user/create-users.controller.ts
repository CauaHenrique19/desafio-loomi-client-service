import { UserAlreadyExists } from '@client-service/domain/errors';
import { CreateUserUseCase } from '@client-service/domain/usecases';
import {
  badRequest,
  createdSuccess,
  serverError,
} from '@client-service/presentation/helpers/http-helper';
import {
  Controller,
  HttpResponse,
} from '@client-service/presentation/protocols';

export class CreateUserController implements Controller {
  constructor(private readonly createUser: CreateUserUseCase) {}

  async handle(
    request: CreateUserController.Parameters,
  ): Promise<HttpResponse> {
    try {
      const createdUser = await this.createUser.create(request);
      return createdSuccess(createdUser);
    } catch (error) {
      if (error instanceof UserAlreadyExists) {
        return badRequest(error);
      }

      return serverError(error);
    }
  }
}

export namespace CreateUserController {
  export type Parameters = CreateUserUseCase.Parameters;
}
