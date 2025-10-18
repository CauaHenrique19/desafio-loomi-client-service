import { UserModel } from '@client-service/domain/models';

export interface DeleteUserRepository {
  delete(
    parameters: DeleteUserRepository.Parameters,
  ): Promise<DeleteUserRepository.Result>;
}

export namespace DeleteUserRepository {
  export type Parameters = Pick<UserModel, 'id'>;
  export type Result = void;
}
