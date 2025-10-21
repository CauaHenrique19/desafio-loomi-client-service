import { FindUsersUseCase } from '@client-service/domain/usecases';
import { BuildFindUsersController } from '@client-service/main/factories/controllers';
import { FindUsersController } from '@client-service/presentation/controllers';

const makeFindUsers = () => {
  class FindUsersStub implements FindUsersUseCase {
    async find(): Promise<FindUsersUseCase.Result> {
      return new Promise((resolve) => resolve([]));
    }
  }

  return new FindUsersStub();
};

export interface sutTypes {
  sut: FindUsersController;
  findUsersStub: FindUsersUseCase;
}

const makeSut = (): sutTypes => {
  const findUsersStub = makeFindUsers();
  const sut = new FindUsersController(findUsersStub);

  return {
    sut,
    findUsersStub,
  };
};

jest.mock(
  '@client-service/main/factories/controllers/user/find-users.factory.ts',
);

describe('BuildFindUsersController', () => {
  test('Should be able to build the controller correctly', () => {
    const { findUsersStub } = makeSut();
    new BuildFindUsersController(findUsersStub);

    expect(BuildFindUsersController).toHaveBeenCalledWith(findUsersStub);
  });
});
