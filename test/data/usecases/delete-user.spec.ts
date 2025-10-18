import {
  DeleteUserRepository,
  FindUsersRepository,
} from '@client-service/data/protocols/db';
import { MessageBroker } from '@client-service/data/protocols/message-broker/message-broker';
import { DeleteUser } from '@client-service/data/usecases';
import { UserNotFoundError } from '@client-service/domain/errors';
import { UserModel } from '@client-service/domain/models';
import { StatusEnum } from '@client-service/domain/enums';

export const makeFakeUser = (): UserModel[] => [
  {
    id: '1-abc123',
    name: 'Cauã',
    email: 'test@gmail.com',
    address: 'Rua Mock 123, RJ',
    bankAccount: '123456',
    digit: '1',
    pictureKey: 'mock-key',
    pictureUrl: 'mock-url',
    status: StatusEnum.ACTIVE,
    createdAt: new Date(),
  },
];

const fakeUser = makeFakeUser();

const makeFindUsersRepository = (): FindUsersRepository => {
  class FindUsersRepositoryStub implements FindUsersRepository {
    async find(): Promise<FindUsersRepository.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }
  return new FindUsersRepositoryStub();
};

const makeDeleteUserRepository = (): DeleteUserRepository => {
  class DeleteUserRepositoryStub implements DeleteUserRepository {
    async delete(): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new DeleteUserRepositoryStub();
};

const makeMessageBroker = (): MessageBroker => {
  class MessageBrokerStub implements MessageBroker {
    async sendMessage(): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new MessageBrokerStub();
};

interface SutTypes {
  sut: DeleteUser;
  findUsersRepositoryStub: FindUsersRepository;
  deleteUserRepositoryStub: DeleteUserRepository;
  messageBrokerStub: MessageBroker;
}

const makeSut = (): SutTypes => {
  const findUsersRepositoryStub = makeFindUsersRepository();
  const deleteUserRepositoryStub = makeDeleteUserRepository();
  const messageBrokerStub = makeMessageBroker();
  const sut = new DeleteUser(
    findUsersRepositoryStub,
    deleteUserRepositoryStub,
    messageBrokerStub,
  );

  return {
    sut,
    findUsersRepositoryStub,
    deleteUserRepositoryStub,
    messageBrokerStub,
  };
};

describe('DeleteUser UseCase', () => {
  test('Should call FindUsersRepository with correct id', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(findUsersRepositoryStub, 'find');

    await sut.delete({ id: '1-abc123' });

    expect(findSpy).toHaveBeenCalledWith({ id: '1-abc123' });
    expect(findSpy).toHaveBeenCalledTimes(1);
  });

  test('Should throw UserNotFoundError if user not found', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();

    jest
      .spyOn(findUsersRepositoryStub, 'find')
      .mockReturnValueOnce(new Promise((resolve) => resolve([])));

    await expect(sut.delete({ id: 'non-existing-id' })).rejects.toThrow(
      UserNotFoundError,
    );
  });

  test('Should call DeleteUserRepository with correct values', async () => {
    const { sut, deleteUserRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteUserRepositoryStub, 'delete');

    await sut.delete({ id: '1-abc123' });

    expect(deleteSpy).toHaveBeenCalledWith({ id: '1-abc123' });
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  test('Should call MessageBroker with correct topic and message', async () => {
    const { sut, messageBrokerStub } = makeSut();
    const sendSpy = jest.spyOn(messageBrokerStub, 'sendMessage');

    const now = new Date();
    jest.useFakeTimers().setSystemTime(now);

    await sut.delete({ id: '1-abc123' });

    expect(sendSpy).toHaveBeenCalledWith({
      topicName: 'deleted_user',
      message: {
        id: '1-abc123',
        deletedAt: now,
      },
    });

    jest.useRealTimers();
  });

  test('Should throw if DeleteUserRepository throws', async () => {
    const { sut, deleteUserRepositoryStub } = makeSut();

    jest
      .spyOn(deleteUserRepositoryStub, 'delete')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.delete({ id: '1-abc123' });

    await expect(promise).rejects.toThrow();
  });

  test('Should not throw if user is successfully deleted', async () => {
    const { sut } = makeSut();

    const promise = sut.delete({ id: '1-abc123' });

    await expect(promise).resolves.not.toThrow();
  });
});
