import { UserModel } from '@client-service/domain/models';

export interface CreateUserUseCase {
  create(
    parameters: CreateUserUseCase.Parameters,
  ): Promise<CreateUserUseCase.Result>;
}

export namespace CreateUserUseCase {
  export type Parameters = Omit<UserModel, 'id' | 'status' | 'createdAt'>;
  export type Result = UserModel;
}
