import { DeleteUserUseCase } from '@client-service/domain/usecases';
import { DeleteUserController } from '@client-service/presentation/controllers';
import {
  noContent,
  serverError,
} from '@client-service/presentation/helpers/http-helper';
import { makeFakeUser } from 'test/data/usecases/find-user.spec';

const fakeUser = makeFakeUser()[0];

const makeDeleteUserUseCase = (): DeleteUserUseCase => {
  class DeleteUserUseCaseStub implements DeleteUserUseCase {
    async delete(parameters: DeleteUserUseCase.Parameters): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }

  return new DeleteUserUseCaseStub();
};

interface SutTypes {
  sut: DeleteUserController;
  deleteUserUseCaseStub: DeleteUserUseCase;
}

const makeSut = (): SutTypes => {
  const deleteUserUseCaseStub = makeDeleteUserUseCase();
  const sut = new DeleteUserController(deleteUserUseCaseStub);

  return { sut, deleteUserUseCaseStub };
};

describe('DeleteUserController', () => {
  test('Should call DeleteUserUseCase with correct values', async () => {
    const { sut, deleteUserUseCaseStub } = makeSut();
    const spy = jest.spyOn(deleteUserUseCaseStub, 'delete');

    await sut.handle({ id: fakeUser.id });

    expect(spy).toHaveBeenCalledWith({ id: fakeUser.id });
  });

  test('Should return 204 (no content) on success', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({ id: fakeUser.id });
    expect(httpResponse).toEqual(noContent());
  });

  test('Should return 500 if DeleteUserUseCase throws', async () => {
    const { sut, deleteUserUseCaseStub } = makeSut();
    const error = new Error('Generic Error');

    jest.spyOn(deleteUserUseCaseStub, 'delete').mockImplementationOnce(() => {
      throw error;
    });

    const httpResponse = await sut.handle({ id: fakeUser.id });
    expect(httpResponse).toEqual(serverError(error));
  });
});
