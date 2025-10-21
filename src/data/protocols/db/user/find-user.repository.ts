import { UserModel } from '@client-service/domain/models';

export interface FindUserRepository {
  findOne(
    parameters?: FindUserRepository.Parameters,
  ): Promise<FindUserRepository.Result>;
}

export namespace FindUserRepository {
  export type Parameters = {
    email?: string;
  };
  export type Result = UserModel | null;
}
