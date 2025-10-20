import { UpdatePictureUserUseCase } from '@client-service/domain/usecases';
import { BuildUpdateUserPictureController } from '@client-service/main/factories/controllers';
import { UpdateUserPictureController } from '@client-service/presentation/controllers';
import { makeFakeUser } from 'test/data/usecases/find-user.spec';

const fakeUser = makeFakeUser()[0];

const makeUpdateUserPicture = () => {
  class UpdateUserPictureSub implements UpdatePictureUserUseCase {
    async update(): Promise<UpdatePictureUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new UpdateUserPictureSub();
};

export interface sutTypes {
  sut: UpdateUserPictureController;
  updateUserPictureStub: UpdatePictureUserUseCase;
}

const makeSut = (): sutTypes => {
  const updateUserPictureStub = makeUpdateUserPicture();
  const sut = new UpdateUserPictureController(updateUserPictureStub);

  return {
    sut,
    updateUserPictureStub,
  };
};

jest.mock(
  '@client-service/main/factories/controllers/user/update-user-picture.factory.ts',
);

describe('BuildUpdateUserPictureController', () => {
  test('Should be able to build the controller correctly', () => {
    const { updateUserPictureStub } = makeSut();
    new BuildUpdateUserPictureController(updateUserPictureStub);

    expect(BuildUpdateUserPictureController).toHaveBeenCalledWith(
      updateUserPictureStub,
    );
  });
});
