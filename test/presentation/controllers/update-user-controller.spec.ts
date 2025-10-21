import { UserNotFoundError } from '@client-service/domain/errors';
import { UpdateUserUseCase } from '@client-service/domain/usecases';
import { UpdateUserController } from '@client-service/presentation/controllers';
import {
  ok,
  notFound,
  serverError,
} from '@client-service/presentation/helpers/http-helper';
import { makeFakeUser } from 'test/data/usecases/find-user.spec';

const fakeUser = makeFakeUser()[0];

const makeUpdateUserUseCase = (): UpdateUserUseCase => {
  class UpdateUserUseCaseStub implements UpdateUserUseCase {
    async update(
      parameters: UpdateUserUseCase.Parameters,
    ): Promise<UpdateUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new UpdateUserUseCaseStub();
};

interface SutTypes {
  sut: UpdateUserController;
  updateUserUseCaseStub: UpdateUserUseCase;
}

const makeSut = (): SutTypes => {
  const updateUserUseCaseStub = makeUpdateUserUseCase();
  const sut = new UpdateUserController(updateUserUseCaseStub);

  return { sut, updateUserUseCaseStub };
};

describe('UpdateUserController', () => {
  test('Should call UpdateUserUseCase with correct values', async () => {
    const { sut, updateUserUseCaseStub } = makeSut();
    const spy = jest.spyOn(updateUserUseCaseStub, 'update');

    const params: UpdateUserController.Parameters = {
      id: fakeUser.id,
      name: 'Updated Name',
      email: fakeUser.email,
      address: fakeUser.address,
      bankAccount: fakeUser.bankAccount,
      digit: fakeUser.digit,
    };

    await sut.handle(params);
    expect(spy).toHaveBeenCalledWith(params);
  });

  test('Should return 200 (ok) if user is updated', async () => {
    const { sut } = makeSut();

    const params: UpdateUserController.Parameters = {
      id: fakeUser.id,
      name: 'Updated Name',
      email: fakeUser.email,
      address: fakeUser.address,
      bankAccount: fakeUser.bankAccount,
      digit: fakeUser.digit,
    };

    const httpResponse = await sut.handle(params);
    expect(httpResponse).toEqual(ok(fakeUser));
  });

  test('Should return 404 if UserNotFoundError is thrown', async () => {
    const { sut, updateUserUseCaseStub } = makeSut();
    const error = new UserNotFoundError();

    jest.spyOn(updateUserUseCaseStub, 'update').mockImplementationOnce(() => {
      throw error;
    });

    const params: UpdateUserController.Parameters = {
      id: 'non-existing-id',
      name: 'Updated Name',
      email: fakeUser.email,
      address: fakeUser.address,
      bankAccount: fakeUser.bankAccount,
      digit: fakeUser.digit,
    };

    const httpResponse = await sut.handle(params);
    expect(httpResponse).toEqual(notFound(error));
  });

  test('Should return 500 if UpdateUserUseCase throws a generic error', async () => {
    const { sut, updateUserUseCaseStub } = makeSut();
    const error = new Error('Generic Error');

    jest.spyOn(updateUserUseCaseStub, 'update').mockImplementationOnce(() => {
      throw error;
    });

    const params: UpdateUserController.Parameters = {
      id: fakeUser.id,
      name: 'Updated Name',
      email: fakeUser.email,
      address: fakeUser.address,
      bankAccount: fakeUser.bankAccount,
      digit: fakeUser.digit,
    };

    const httpResponse = await sut.handle(params);
    expect(httpResponse).toEqual(serverError(error));
  });
});
