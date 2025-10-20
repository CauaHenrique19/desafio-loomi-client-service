import { UserAlreadyExists } from '@client-service/domain/errors';
import { CreateUserUseCase } from '@client-service/domain/usecases';
import { CreateUserController } from '@client-service/presentation/controllers';

import {
  createdSuccess,
  badRequest,
  serverError,
} from '@client-service/presentation/helpers/http-helper';
import { makeFakeUser } from 'test/data/usecases/find-user.spec';

const fakeUser = makeFakeUser()[0];

const makeCreateUserUseCase = (): CreateUserUseCase => {
  class CreateUserUseCaseStub implements CreateUserUseCase {
    async create(
      parameters: CreateUserUseCase.Parameters,
    ): Promise<CreateUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new CreateUserUseCaseStub();
};

interface SutTypes {
  sut: CreateUserController;
  createUserUseCaseStub: CreateUserUseCase;
}

const makeSut = (): SutTypes => {
  const createUserUseCaseStub = makeCreateUserUseCase();
  const sut = new CreateUserController(createUserUseCaseStub);

  return { sut, createUserUseCaseStub };
};

describe('CreateUserController', () => {
  test('Should call CreateUserUseCase with correct values', async () => {
    const { sut, createUserUseCaseStub } = makeSut();
    const spy = jest.spyOn(createUserUseCaseStub, 'create');

    const params: CreateUserController.Parameters = fakeUser;
    await sut.handle(params);

    expect(spy).toHaveBeenCalledWith(params);
  });

  test('Should return 201 if user is created successfully', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(fakeUser);
    expect(httpResponse).toEqual(createdSuccess(fakeUser));
  });

  test('Should return 400 if UserAlreadyExists is thrown', async () => {
    const { sut, createUserUseCaseStub } = makeSut();
    const error = new UserAlreadyExists();

    jest.spyOn(createUserUseCaseStub, 'create').mockImplementationOnce(() => {
      throw error;
    });

    const httpResponse = await sut.handle(fakeUser);
    expect(httpResponse).toEqual(badRequest(error));
  });

  test('Should return 500 if CreateUserUseCase throws', async () => {
    const { sut, createUserUseCaseStub } = makeSut();
    const error = new Error('Generic Error');

    jest.spyOn(createUserUseCaseStub, 'create').mockImplementationOnce(() => {
      throw error;
    });

    const httpResponse = await sut.handle(fakeUser);
    expect(httpResponse).toEqual(serverError(error));
  });
});
