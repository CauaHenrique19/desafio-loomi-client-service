import { UserModel } from '@client-service/domain/models';

export interface UpdateUserUseCase {
  update(
    parameters: UpdateUserUseCase.Parameters,
  ): Promise<UpdateUserUseCase.Result>;
}

export namespace UpdateUserUseCase {
  export type Parameters = Pick<UserModel, 'id'> &
    Partial<Omit<UserModel, 'id' | 'status' | 'createdAt' | 'deletedAt'>>;
  export type Result = UserModel;
}
