import { UserNotFoundError } from '@client-service/domain/errors';
import { UpdatePictureUserUseCase } from '@client-service/domain/usecases';
import { UpdateUserPictureController } from '@client-service/presentation/controllers';
import {
  ok,
  notFound,
  serverError,
} from '@client-service/presentation/helpers/http-helper';
import { makeFakeUser } from 'test/data/usecases/find-user.spec';

const fakeUser = makeFakeUser()[0];

const makeUpdatePictureUserUseCase = (): UpdatePictureUserUseCase => {
  class UpdatePictureUserUseCaseStub implements UpdatePictureUserUseCase {
    async update(
      parameters: UpdatePictureUserUseCase.Parameters,
    ): Promise<UpdatePictureUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new UpdatePictureUserUseCaseStub();
};

interface SutTypes {
  sut: UpdateUserPictureController;
  updatePictureUserUseCaseStub: UpdatePictureUserUseCase;
}

const makeSut = (): SutTypes => {
  const updatePictureUserUseCaseStub = makeUpdatePictureUserUseCase();
  const sut = new UpdateUserPictureController(updatePictureUserUseCaseStub);

  return { sut, updatePictureUserUseCaseStub };
};

describe('UpdateUserPictureController', () => {
  test('Should call UpdatePictureUserUseCase with correct values', async () => {
    const { sut, updatePictureUserUseCaseStub } = makeSut();
    const spy = jest.spyOn(updatePictureUserUseCaseStub, 'update');

    const params: UpdateUserPictureController.Parameters = {
      id: fakeUser.id,
      picture: { value: Buffer.from(''), mimeType: 'image/png' },
    };

    await sut.handle(params);

    expect(spy).toHaveBeenCalledWith(params);
  });

  test('Should return 200 (ok) if user picture is updated', async () => {
    const { sut } = makeSut();

    const params: UpdateUserPictureController.Parameters = {
      id: fakeUser.id,
      picture: { value: Buffer.from(''), mimeType: 'image/png' },
    };

    const httpResponse = await sut.handle(params);
    expect(httpResponse).toEqual(ok(fakeUser));
  });

  test('Should return 404 if UserNotFoundError is thrown', async () => {
    const { sut, updatePictureUserUseCaseStub } = makeSut();
    const error = new UserNotFoundError();

    jest
      .spyOn(updatePictureUserUseCaseStub, 'update')
      .mockImplementationOnce(() => {
        throw error;
      });

    const params: UpdateUserPictureController.Parameters = {
      id: 'non-existing-id',
      picture: { value: Buffer.from(''), mimeType: 'image/png' },
    };

    const httpResponse = await sut.handle(params);
    expect(httpResponse).toEqual(notFound(error));
  });

  test('Should return 500 if UpdatePictureUserUseCase throws a generic error', async () => {
    const { sut, updatePictureUserUseCaseStub } = makeSut();
    const error = new Error('Generic Error');

    jest
      .spyOn(updatePictureUserUseCaseStub, 'update')
      .mockImplementationOnce(() => {
        throw error;
      });

    const params: UpdateUserPictureController.Parameters = {
      id: fakeUser.id,
      picture: { value: Buffer.from(''), mimeType: 'image/png' },
    };

    const httpResponse = await sut.handle(params);
    expect(httpResponse).toEqual(serverError(error));
  });
});
