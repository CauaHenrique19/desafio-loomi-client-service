import { UserModel } from '@client-service/domain/models';

export interface UpdatePictureUserUseCase {
  update(
    parameters: UpdatePictureUserUseCase.Parameters,
  ): Promise<UpdatePictureUserUseCase.Result>;
}

export namespace UpdatePictureUserUseCase {
  export type File = {
    value: Buffer;
    mimeType: string;
  };
  export type Parameters = Pick<UserModel, 'id'> & {
    picture: File;
  };
  export type Result = UserModel;
}
