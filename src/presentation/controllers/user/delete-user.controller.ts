import { DeleteUserUseCase } from '@client-service/domain/usecases';
import {
  noContent,
  serverError,
} from '@client-service/presentation/helpers/http-helper';
import {
  Controller,
  HttpResponse,
} from '@client-service/presentation/protocols';

export class DeleteUserController implements Controller {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  async handle(
    request: DeleteUserController.Parameters,
  ): Promise<HttpResponse> {
    try {
      await this.deleteUserUseCase.delete(request);
      return noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace DeleteUserController {
  export type Parameters = DeleteUserUseCase.Parameters;
}
