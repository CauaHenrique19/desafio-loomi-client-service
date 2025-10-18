import { agent } from 'supertest';
import { Test } from '@nestjs/testing';
import { UserController } from '@client-service/main/controllers/user/user.controller';
import { BuildFindUsersController } from '@client-service/main/factories/controllers';
import { BuildCreateUserController } from '@client-service/main/factories/controllers';
import { BuildUpdateUserController } from '@client-service/main/factories/controllers';
import { BuildDeleteUserController } from '@client-service/main/factories/controllers';
import { BuildUpdateUserPictureController } from '@client-service/main/factories/controllers';
import {
  UserNotFoundError,
  UserAlreadyExists,
} from '@client-service/domain/errors';
import { makeFakeUser } from 'test/data/usecases/find-user.spec';
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  FindUsersUseCase,
  UpdatePictureUserUseCase,
  UpdateUserUseCase,
} from '@client-service/domain/usecases';

const fakeUser = makeFakeUser()[0];

const makeFindUsers = () => {
  class FindUsersStub implements FindUsersUseCase {
    async find(): Promise<FindUsersUseCase.Result> {
      return new Promise((resolve) => resolve([]));
    }
  }

  return new FindUsersStub();
};

const makeCreateUser = () => {
  class CreateUsersStub implements CreateUserUseCase {
    async create(): Promise<CreateUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new CreateUsersStub();
};

const makeDeleteUser = () => {
  class DeleteUsersStub implements DeleteUserUseCase {
    async delete(): Promise<DeleteUserUseCase.Result> {
      return new Promise((resolve) => resolve());
    }
  }

  return new DeleteUsersStub();
};

const makeUpdateUserPicture = () => {
  class UpdateUserPictureSub implements UpdatePictureUserUseCase {
    async update(): Promise<UpdatePictureUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new UpdateUserPictureSub();
};

const makeUpdateUser = () => {
  class UpdateUsersStub implements UpdateUserUseCase {
    async update(): Promise<UpdateUserUseCase.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }

  return new UpdateUsersStub();
};

export interface sutTypes {
  findUsersStub: FindUsersUseCase;
  createUsersStub: CreateUserUseCase;
  updateUsersStub: UpdateUserUseCase;
  updateUserPictureStub: UpdatePictureUserUseCase;
  deleteUsersStub: DeleteUserUseCase;
}

const makeSut = (): sutTypes => {
  const findUsersStub = makeFindUsers();
  const createUsersStub = makeCreateUser();
  const updateUsersStub = makeUpdateUser();
  const updateUserPictureStub = makeUpdateUserPicture();
  const deleteUsersStub = makeDeleteUser();

  return {
    findUsersStub,
    createUsersStub,
    updateUsersStub,
    updateUserPictureStub,
    deleteUsersStub,
  };
};

const createModule = async (
  findUsersStub: FindUsersUseCase,
  createUsersStub: CreateUserUseCase,
  updateUsersStub: UpdateUserUseCase,
  updateUserPictureStub: UpdatePictureUserUseCase,
  deleteUsersStub: DeleteUserUseCase,
) => {
  const module = await Test.createTestingModule({
    controllers: [UserController],
    providers: [
      {
        provide: BuildFindUsersController.name,
        useFactory: () => new BuildFindUsersController(findUsersStub),
      },
      {
        provide: BuildCreateUserController.name,
        useFactory: () => new BuildCreateUserController(createUsersStub),
      },
      {
        provide: BuildUpdateUserController.name,
        useFactory: () => new BuildUpdateUserController(updateUsersStub),
      },
      {
        provide: BuildDeleteUserController.name,
        useFactory: () => new BuildDeleteUserController(deleteUsersStub),
      },
      {
        provide: BuildUpdateUserPictureController.name,
        useFactory: () =>
          new BuildUpdateUserPictureController(updateUserPictureStub),
      },
    ],
  }).compile();

  return module;
};

describe('UserController (Integration)', () => {
  describe('GET /users/:id', () => {
    it('Should return 200 on success', async () => {
      const {
        createUsersStub,
        deleteUsersStub,
        findUsersStub,
        updateUserPictureStub,
        updateUsersStub,
      } = makeSut();
      const module = await createModule(
        findUsersStub,
        createUsersStub,
        updateUsersStub,
        updateUserPictureStub,
        deleteUsersStub,
      );
      const app = module.createNestApplication();
      await app.init();
      await agent(app.getHttpServer()).get(`/users/${fakeUser.id}`).expect(200);
    });

    it('Should return 404 if user not found', async () => {
      const {
        createUsersStub,
        deleteUsersStub,
        findUsersStub,
        updateUserPictureStub,
        updateUsersStub,
      } = makeSut();
      const module = await createModule(
        findUsersStub,
        createUsersStub,
        updateUsersStub,
        updateUserPictureStub,
        deleteUsersStub,
      );

      jest.spyOn(findUsersStub, 'find').mockImplementationOnce(async () => {
        throw new UserNotFoundError();
      });

      const app = module.createNestApplication();
      await app.init();

      await agent(app.getHttpServer())
        .get(`/users/non-existing-id`)
        .expect(404);
    });

    it('Should return 500 on generic error', async () => {
      const {
        createUsersStub,
        deleteUsersStub,
        findUsersStub,
        updateUserPictureStub,
        updateUsersStub,
      } = makeSut();
      const module = await createModule(
        findUsersStub,
        createUsersStub,
        updateUsersStub,
        updateUserPictureStub,
        deleteUsersStub,
      );

      jest.spyOn(findUsersStub, 'find').mockImplementationOnce(async () => {
        throw new Error();
      });

      const app = module.createNestApplication();
      await app.init();
      await agent(app.getHttpServer()).get(`/users/${fakeUser.id}`).expect(500);
    });
  });

  describe('POST /users', () => {
    it('Should return 201 on success', async () => {
      const {
        createUsersStub,
        deleteUsersStub,
        findUsersStub,
        updateUserPictureStub,
        updateUsersStub,
      } = makeSut();
      const module = await createModule(
        findUsersStub,
        createUsersStub,
        updateUsersStub,
        updateUserPictureStub,
        deleteUsersStub,
      );
      const app = module.createNestApplication();
      await app.init();
      await agent(app.getHttpServer())
        .post(`/users`)
        .send({
          name: fakeUser.name,
          email: fakeUser.email,
          address: fakeUser.address,
          bankAccount: fakeUser.bankAccount,
          digit: fakeUser.digit,
        })
        .expect(201);
    });

    it('Should return 400 if UserAlreadyExists', async () => {
      const {
        createUsersStub,
        deleteUsersStub,
        findUsersStub,
        updateUserPictureStub,
        updateUsersStub,
      } = makeSut();
      const module = await createModule(
        findUsersStub,
        createUsersStub,
        updateUsersStub,
        updateUserPictureStub,
        deleteUsersStub,
      );

      jest.spyOn(createUsersStub, 'create').mockImplementationOnce(async () => {
        throw new UserAlreadyExists();
      });

      const app = module.createNestApplication();
      await app.init();

      await agent(app.getHttpServer())
        .post(`/users`)
        .send({
          name: fakeUser.name,
          email: fakeUser.email,
          address: fakeUser.address,
          bankAccount: fakeUser.bankAccount,
          digit: fakeUser.digit,
        })
        .expect(400);
    });

    it('Should return 500 on generic error', async () => {
      const {
        createUsersStub,
        deleteUsersStub,
        findUsersStub,
        updateUserPictureStub,
        updateUsersStub,
      } = makeSut();
      const module = await createModule(
        findUsersStub,
        createUsersStub,
        updateUsersStub,
        updateUserPictureStub,
        deleteUsersStub,
      );

      jest.spyOn(createUsersStub, 'create').mockImplementationOnce(async () => {
        throw new Error();
      });
      const app = module.createNestApplication();
      await app.init();

      await agent(app.getHttpServer())
        .post(`/users`)
        .send({
          name: fakeUser.name,
          email: fakeUser.email,
          address: fakeUser.address,
          bankAccount: fakeUser.bankAccount,
          digit: fakeUser.digit,
        })
        .expect(500);
    });
  });

  describe('PATCH /users/:id', () => {
    it('Should return 200 on success', async () => {
      const {
        createUsersStub,
        deleteUsersStub,
        findUsersStub,
        updateUserPictureStub,
        updateUsersStub,
      } = makeSut();
      const module = await createModule(
        findUsersStub,
        createUsersStub,
        updateUsersStub,
        updateUserPictureStub,
        deleteUsersStub,
      );
      const app = module.createNestApplication();
      await app.init();

      await agent(app.getHttpServer())
        .patch(`/users/${fakeUser.id}`)
        .send({ name: 'Updated Name' })
        .expect(200);
    });
  });

  describe('DELETE /users/:id', () => {
    it('Should return 204 on success', async () => {
      const {
        createUsersStub,
        deleteUsersStub,
        findUsersStub,
        updateUserPictureStub,
        updateUsersStub,
      } = makeSut();
      const module = await createModule(
        findUsersStub,
        createUsersStub,
        updateUsersStub,
        updateUserPictureStub,
        deleteUsersStub,
      );
      const app = module.createNestApplication();
      await app.init();
      await agent(app.getHttpServer())
        .delete(`/users/${fakeUser.id}`)
        .expect(204);
    });
  });

  describe('PATCH /users/:id/profile-picture', () => {
    it('Should return 200 on success', async () => {
      const {
        createUsersStub,
        deleteUsersStub,
        findUsersStub,
        updateUserPictureStub,
        updateUsersStub,
      } = makeSut();
      const module = await createModule(
        findUsersStub,
        createUsersStub,
        updateUsersStub,
        updateUserPictureStub,
        deleteUsersStub,
      );
      const app = module.createNestApplication();
      await app.init();
      await agent(app.getHttpServer())
        .patch(`/users/${fakeUser.id}/profile-picture`)
        .attach('picture', Buffer.from('fake image'), {
          filename: 'picture.png',
          contentType: 'image/png',
        })
        .expect(200);
    });
  });
});
