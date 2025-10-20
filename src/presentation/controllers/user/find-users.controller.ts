import { UserNotFoundError } from '@client-service/domain/errors';
import { FindUsersUseCase } from '@client-service/domain/usecases';
import {
  notFound,
  ok,
  serverError,
} from '@client-service/presentation/helpers/http-helper';
import {
  Controller,
  HttpResponse,
} from '@client-service/presentation/protocols';

export class FindUsersController implements Controller {
  constructor(private readonly findUsers: FindUsersUseCase) {}

  async handle(request: FindUsersController.Parameters): Promise<HttpResponse> {
    try {
      const users = await this.findUsers.find(request);
      return ok(users);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return notFound(error);
      }

      return serverError(error);
    }
  }
}

export namespace FindUsersController {
  export type Parameters = FindUsersUseCase.Parameters;
}
