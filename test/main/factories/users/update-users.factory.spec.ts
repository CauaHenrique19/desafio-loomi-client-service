import { UpdateUserUseCase } from '@client-service/domain/usecases';
import { BuildUpdateUserController } from '@client-service/main/factories/controllers';
import { UpdateUserController } from '@client-service/presentation/controllers';
import { makeFakeUser } from 'test/data/usecases/find-user.spec';

const fakeUser = makeFakeUser()[0];

const makeUpdateUser = () => {
  class UpdateUsersStub implements UpdateUserUseCase {
    async update(): Promise<UpdateUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new UpdateUsersStub();
};

export interface sutTypes {
  sut: UpdateUserController;
  updateUsersStub: UpdateUserUseCase;
}

const makeSut = (): sutTypes => {
  const updateUsersStub = makeUpdateUser();
  const sut = new UpdateUserController(updateUsersStub);

  return {
    sut,
    updateUsersStub,
  };
};

jest.mock(
  '@client-service/main/factories/controllers/user/update-user.factory.ts',
);

describe('BuildUpdateUserController', () => {
  test('Should be able to build the controller correctly', () => {
    const { updateUsersStub } = makeSut();
    new BuildUpdateUserController(updateUsersStub);

    expect(BuildUpdateUserController).toHaveBeenCalledWith(updateUsersStub);
  });
});
