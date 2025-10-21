import {
  UpdateUserRepository,
  FindUsersRepository,
} from '@client-service/data/protocols/db';
import { GenerateRandomCharacters } from '@client-service/data/protocols/encrypt';
import {
  FileStorage,
  UploadResult,
} from '@client-service/data/protocols/storage';
import { UpdateUserPicture } from '@client-service/data/usecases';
import { UserNotFoundError } from '@client-service/domain/errors';
import { UserModel } from '@client-service/domain/models';
import { StatusEnum } from '@client-service/domain/enums';

export const makeFakeUser = (): UserModel[] => [
  {
    id: '1-abc123',
    name: 'Cauã',
    email: 'test@gmail.com',
    address: 'Rua Mock 123, RJ',
    bankAccount: '123456',
    digit: '1',
    pictureKey: 'old-key',
    pictureUrl: 'old-url',
    status: StatusEnum.ACTIVE,
    createdAt: new Date(),
  },
];

const fakeUser = makeFakeUser();

const makeFindUsersRepository = (): FindUsersRepository => {
  class FindUsersRepositoryStub implements FindUsersRepository {
    async find(): Promise<FindUsersRepository.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }
  return new FindUsersRepositoryStub();
};

const makeGenerateRandomCharacters = (): GenerateRandomCharacters => {
  class GenerateRandomCharactersStub implements GenerateRandomCharacters {
    async generateRandomCharacters(): Promise<string> {
      return new Promise((resolve) => resolve('RANDOM1234'));
    }
  }
  return new GenerateRandomCharactersStub();
};

const makeFileStorage = (): FileStorage => {
  class FileStorageStub implements FileStorage {
    async upload(): Promise<UploadResult> {
      return new Promise((resolve) =>
        resolve({
          key: 'new-picture-key',
          url: 'https://cdn.example.com/new-picture.png',
        }),
      );
    }
  }
  return new FileStorageStub();
};

const makeUpdateUserRepository = (): UpdateUserRepository => {
  class UpdateUserRepositoryStub implements UpdateUserRepository {
    async update(): Promise<UpdateUserRepository.Result> {
      return new Promise((resolve) => resolve(fakeUser[0]));
    }
  }
  return new UpdateUserRepositoryStub();
};

interface SutTypes {
  sut: UpdateUserPicture;
  findUsersRepositoryStub: FindUsersRepository;
  generateRandomCharactersStub: GenerateRandomCharacters;
  fileStorageStub: FileStorage;
  updateUserRepositoryStub: UpdateUserRepository;
}

const makeSut = (): SutTypes => {
  const findUsersRepositoryStub = makeFindUsersRepository();
  const generateRandomCharactersStub = makeGenerateRandomCharacters();
  const fileStorageStub = makeFileStorage();
  const updateUserRepositoryStub = makeUpdateUserRepository();

  const sut = new UpdateUserPicture(
    findUsersRepositoryStub,
    generateRandomCharactersStub,
    fileStorageStub,
    updateUserRepositoryStub,
  );

  return {
    sut,
    findUsersRepositoryStub,
    generateRandomCharactersStub,
    fileStorageStub,
    updateUserRepositoryStub,
  };
};

describe('UpdateUserPicture UseCase', () => {
  test('Should call FindUsersRepository with correct id', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(findUsersRepositoryStub, 'find');

    await sut.update({
      id: '1-abc123',
      picture: { value: Buffer.from('fake'), mimeType: 'image/png' },
    });

    expect(findSpy).toHaveBeenCalledWith({ id: '1-abc123' });
    expect(findSpy).toHaveBeenCalledTimes(1);
  });

  test('Should throw UserNotFoundError if user not found', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();

    jest
      .spyOn(findUsersRepositoryStub, 'find')
      .mockReturnValueOnce(new Promise((resolve) => resolve([])));

    await expect(
      sut.update({
        id: 'invalid-id',
        picture: { value: Buffer.from('fake'), mimeType: 'image/png' },
      }),
    ).rejects.toThrow(UserNotFoundError);
  });

  test('Should call GenerateRandomCharacters with correct size', async () => {
    const { sut, generateRandomCharactersStub } = makeSut();
    const generateSpy = jest.spyOn(
      generateRandomCharactersStub,
      'generateRandomCharacters',
    );

    await sut.update({
      id: '1-abc123',
      picture: { value: Buffer.from('fake'), mimeType: 'image/png' },
    });

    expect(generateSpy).toHaveBeenCalledWith({ size: 10 });
  });

  test('Should call FileStorage.upload with correct values', async () => {
    const { sut, fileStorageStub } = makeSut();
    const uploadSpy = jest.spyOn(fileStorageStub, 'upload');

    await sut.update({
      id: '1-abc123',
      picture: { value: Buffer.from('fake'), mimeType: 'image/png' },
    });

    expect(uploadSpy).toHaveBeenCalledWith({
      file: Buffer.from('fake'),
      fileKey: '1-abc123-RANDOM1234',
      mimeType: 'image/png',
    });
  });

  test('Should call UpdateUserRepository with correct values', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateUserRepositoryStub, 'update');

    await sut.update({
      id: '1-abc123',
      picture: { value: Buffer.from('fake'), mimeType: 'image/png' },
    });

    expect(updateSpy).toHaveBeenCalledWith({
      id: '1-abc123',
      pictureKey: 'new-picture-key',
      pictureUrl: 'https://cdn.example.com/new-picture.png',
    });
  });

  test('Should throw if UpdateUserRepository throws', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();

    jest
      .spyOn(updateUserRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((_, reject) => reject(new Error('Unexpected error'))),
      );

    const promise = sut.update({
      id: '1-abc123',
      picture: { value: Buffer.from('fake'), mimeType: 'image/png' },
    });

    await expect(promise).rejects.toThrow();
  });

  test('Should return updated user on success', async () => {
    const { sut } = makeSut();

    const result = await sut.update({
      id: '1-abc123',
      picture: { value: Buffer.from('fake'), mimeType: 'image/png' },
    });

    expect(result).toEqual(fakeUser[0]);
  });
});
