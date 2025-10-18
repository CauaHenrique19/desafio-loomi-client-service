import { DeleteUserUseCase } from '@client-service/domain/usecases';
import { BuildDeleteUserController } from '@client-service/main/factories/controllers';
import { DeleteUserController } from '@client-service/presentation/controllers';

const makeDeleteUser = () => {
  class DeleteUsersStub implements DeleteUserUseCase {
    async delete(): Promise<DeleteUserUseCase.Result> {
      return new Promise((resolve) => resolve());
    }
  }

  return new DeleteUsersStub();
};

export interface sutTypes {
  sut: DeleteUserController;
  deleteUsersStub: DeleteUserUseCase;
}

const makeSut = (): sutTypes => {
  const deleteUsersStub = makeDeleteUser();
  const sut = new DeleteUserController(deleteUsersStub);

  return {
    sut,
    deleteUsersStub,
  };
};

jest.mock(
  '@client-service/main/factories/controllers/user/delete-user.factory.ts',
);

describe('BuildDeleteUserController', () => {
  test('Should be able to build the controller correctly', () => {
    const { deleteUsersStub } = makeSut();
    new BuildDeleteUserController(deleteUsersStub);

    expect(BuildDeleteUserController).toHaveBeenCalledWith(deleteUsersStub);
  });
});
