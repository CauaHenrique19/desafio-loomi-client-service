import { UserModel } from '@client-service/domain/models';

export interface FindUsersUseCase {
  find(
    parameters: FindUsersUseCase.Parameters,
  ): Promise<FindUsersUseCase.Result>;
}

export namespace FindUsersUseCase {
  export type Parameters = {
    id?: string;
  };
  export type Result = UserModel[];
}
