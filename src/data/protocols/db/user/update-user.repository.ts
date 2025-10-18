import { UserModel } from '@client-service/domain/models';

export interface UpdateUserRepository {
  update(
    parameters: UpdateUserRepository.Parameters,
  ): Promise<UpdateUserRepository.Result>;
}

export namespace UpdateUserRepository {
  export type Parameters = Pick<UserModel, 'id'> &
    Partial<Omit<UserModel, 'id' | 'status' | 'createdAt' | 'deletedAt'>>;
  export type Result = UserModel;
}
