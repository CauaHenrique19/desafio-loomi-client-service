import { FindUsersRepository } from '@client-service/data/protocols/db';
import { FindUsers } from '@client-service/data/usecases';
import { StatusEnum } from '@client-service/domain/enums';
import { UserNotFoundError } from '@client-service/domain/errors';
import { UserModel } from '@client-service/domain/models';

export const makeFakeUser = (): UserModel[] => [
  {
    id: '1-sadasdasdadassa',
    name: 'Cauã',
    email: 'teste@gmail.com',
    address: 'Rua mock 12, Rio de Janeiro',
    bankAccount: '123456',
    digit: '1',
    pictureKey: 'sdasdsa',
    pictureUrl: 'asdasdadasas',
    status: StatusEnum.ACTIVE,
    createdAt: new Date(),
  },
];

const fakeUser = makeFakeUser();

const makeFindUsersRepository = (): FindUsersRepository => {
  class FindUsersRepositoryStub implements FindUsersRepository {
    async find(): Promise<FindUsersRepository.Result> {
      return new Promise((resolve, reject) => resolve(fakeUser));
    }
  }

  return new FindUsersRepositoryStub();
};

export interface SutTypes {
  sut: FindUsers;
  findUsersRepositoryStub: FindUsersRepository;
}

const makeSut = (): SutTypes => {
  const findUsersRepositoryStub = makeFindUsersRepository();
  const sut = new FindUsers(findUsersRepositoryStub);

  return {
    sut,
    findUsersRepositoryStub,
  };
};

describe('FindUsers UseCase', () => {
  test('Should Call FindUsersRepository', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();

    const findSpy = jest.spyOn(findUsersRepositoryStub, 'find');

    await sut.find({ id: '1-sadasdasdadassa' });

    expect(findSpy).toHaveBeenCalled();
    expect(findSpy).toHaveBeenCalledTimes(1);
  });

  test('Should throw if FindUsersRepository throws', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();
    jest
      .spyOn(findUsersRepositoryStub, 'find')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.find({ id: '1-sadasdasdadassa' });
    await expect(promise).rejects.toThrow();
  });

  test('Should throws UserNotFoundError when not found user', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();

    jest
      .spyOn(findUsersRepositoryStub, 'find')
      .mockReturnValueOnce(new Promise((resolve) => resolve([])));

    await expect(sut.find({ id: '1-sadasdasdadassa' })).rejects.toThrow(
      UserNotFoundError,
    );
  });

  test('Should return user on success', async () => {
    const { sut } = makeSut();

    const account = await sut.find({ id: '1-sadasdasdadassa' });
    expect(account).toEqual(fakeUser);
  });
});
