import { CreateUserUseCase } from '@client-service/domain/usecases';
import { BuildCreateUserController } from '@client-service/main/factories/controllers';
import { CreateUserController } from '@client-service/presentation/controllers';
import { makeFakeUser } from 'test/data/usecases/find-user.spec';

const fakeUser = makeFakeUser()[0];

const makeCreateUser = () => {
  class CreateUsersStub implements CreateUserUseCase {
    async create(): Promise<CreateUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new CreateUsersStub();
};

export interface sutTypes {
  sut: CreateUserController;
  createUsersStub: CreateUserUseCase;
}

const makeSut = (): sutTypes => {
  const createUsersStub = makeCreateUser();
  const sut = new CreateUserController(createUsersStub);

  return {
    sut,
    createUsersStub,
  };
};

jest.mock(
  '@client-service/main/factories/controllers/user/create-user.factory.ts',
);

describe('BuildCreateUserController', () => {
  test('Should be able to build the controller correctly', () => {
    const { createUsersStub } = makeSut();
    new BuildCreateUserController(createUsersStub);

    expect(BuildCreateUserController).toHaveBeenCalledWith(createUsersStub);
  });
});
