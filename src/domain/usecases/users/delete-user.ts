import { UserModel } from '@client-service/domain/models';

export interface DeleteUserUseCase {
  delete(
    parameters: DeleteUserUseCase.Parameters,
  ): Promise<DeleteUserUseCase.Result>;
}

export namespace DeleteUserUseCase {
  export type Parameters = Pick<UserModel, 'id'>;
  export type Result = void;
}
