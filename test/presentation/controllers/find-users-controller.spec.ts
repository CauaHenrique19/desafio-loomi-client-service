import { UserNotFoundError } from '@client-service/domain/errors';
import { FindUsersUseCase } from '@client-service/domain/usecases';
import { FindUsersController } from '@client-service/presentation/controllers';
import {
  notFound,
  ok,
  serverError,
} from '@client-service/presentation/helpers/http-helper';
import { makeFakeUser } from 'test/data/usecases/find-user.spec';

const fakeUsers = makeFakeUser();

const makeFindUsersUseCase = (): FindUsersUseCase => {
  class FindUsersUseCaseStub implements FindUsersUseCase {
    async find(
      parameters: FindUsersUseCase.Parameters,
    ): Promise<FindUsersUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUsers));
    }
  }

  return new FindUsersUseCaseStub();
};

interface SutTypes {
  sut: FindUsersController;
  findUsersUseCaseStub: FindUsersUseCase;
}

const makeSut = (): SutTypes => {
  const findUsersUseCaseStub = makeFindUsersUseCase();
  const sut = new FindUsersController(findUsersUseCaseStub);

  return { sut, findUsersUseCaseStub };
};

describe('FindUsersController', () => {
  test('Should call FindUsersUseCase with correct values', async () => {
    const { sut, findUsersUseCaseStub } = makeSut();
    const spy = jest.spyOn(findUsersUseCaseStub, 'find');

    await sut.handle({ id: '1-sadasdasdadassa' });

    expect(spy).toHaveBeenCalledWith({ id: '1-sadasdasdadassa' });
  });

  test('Should return 200 (ok) if users are found', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({ id: '1-sadasdasdadassa' });
    expect(httpResponse).toEqual(ok(fakeUsers));
  });

  test('Should return 404 if UserNotFoundError is thrown', async () => {
    const { sut, findUsersUseCaseStub } = makeSut();
    const error = new UserNotFoundError();

    jest.spyOn(findUsersUseCaseStub, 'find').mockImplementationOnce(() => {
      throw error;
    });

    const httpResponse = await sut.handle({ id: 'non-existing-id' });
    expect(httpResponse).toEqual(notFound(error));
  });

  test('Should return 500 if FindUsersUseCase throws a generic error', async () => {
    const { sut, findUsersUseCaseStub } = makeSut();
    const error = new Error('Generic Error');

    jest.spyOn(findUsersUseCaseStub, 'find').mockImplementationOnce(() => {
      throw error;
    });

    const httpResponse = await sut.handle({ id: '1-sadasdasdadassa' });
    expect(httpResponse).toEqual(serverError(error));
  });
});
