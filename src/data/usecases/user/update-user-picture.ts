import {
  UpdateUserRepository,
  FindUsersRepository,
} from '@client-service/data/protocols/db';
import { GenerateRandomCharacters } from '@client-service/data/protocols/encrypt';
import { FileStorage } from '@client-service/data/protocols/storage';
import { UserNotFoundError } from '@client-service/domain/errors';
import { UpdatePictureUserUseCase } from '@client-service/domain/usecases';

export class UpdateUserPicture implements UpdatePictureUserUseCase {
  constructor(
    private readonly findUsersRepository: FindUsersRepository,
    private readonly generateRandomCharacters: GenerateRandomCharacters,
    private readonly fileStorage: FileStorage,
    private readonly updateUserRepository: UpdateUserRepository,
  ) {}

  async update(
    parameters: UpdatePictureUserUseCase.Parameters,
  ): Promise<UpdatePictureUserUseCase.Result> {
    const user = await this.findUsersRepository.find({
      id: parameters.id,
    });

    if (!user.length) {
      throw new UserNotFoundError();
    }

    const randomKeyPoster =
      await this.generateRandomCharacters.generateRandomCharacters({
        size: 10,
      });

    const fileKeyPoster = `${parameters.id}-${randomKeyPoster}`;
    const { key, url } = await this.fileStorage.upload({
      file: parameters.picture.value,
      fileKey: fileKeyPoster,
      mimeType: parameters.picture.mimeType,
    });

    const updatedUser = await this.updateUserRepository.update({
      id: parameters.id,
      pictureKey: key,
      pictureUrl: url,
    });
    return updatedUser;
  }
}
