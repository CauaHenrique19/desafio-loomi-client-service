import {
  UpdateUserRepository,
  FindUsersRepository,
} from '@client-service/data/protocols/db';
import { MessageBroker } from '@client-service/data/protocols/message-broker/message-broker';
import { UpdateUser } from '@client-service/data/usecases';
import { UserNotFoundError } from '@client-service/domain/errors';
import { UserModel } from '@client-service/domain/models';
import { StatusEnum } from '@client-service/domain/enums';

export const makeFakeUser = (): UserModel => ({
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
});

const fakeUser = makeFakeUser();

const makeFindUsersRepository = (): FindUsersRepository => {
  class FindUsersRepositoryStub implements FindUsersRepository {
    async find(): Promise<FindUsersRepository.Result> {
      return new Promise((resolve) => resolve([fakeUser]));
    }
  }
  return new FindUsersRepositoryStub();
};

const makeUpdateUserRepository = (): UpdateUserRepository => {
  class UpdateUserRepositoryStub implements UpdateUserRepository {
    async update(): Promise<UpdateUserRepository.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }
  return new UpdateUserRepositoryStub();
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
  sut: UpdateUser;
  findUsersRepositoryStub: FindUsersRepository;
  updateUserRepositoryStub: UpdateUserRepository;
  messageBrokerStub: MessageBroker;
}

const makeSut = (): SutTypes => {
  const findUsersRepositoryStub = makeFindUsersRepository();
  const updateUserRepositoryStub = makeUpdateUserRepository();
  const messageBrokerStub = makeMessageBroker();

  const sut = new UpdateUser(
    findUsersRepositoryStub,
    updateUserRepositoryStub,
    messageBrokerStub,
  );

  return {
    sut,
    findUsersRepositoryStub,
    updateUserRepositoryStub,
    messageBrokerStub,
  };
};

describe('UpdateUser UseCase', () => {
  test('Should call FindUsersRepository with correct id', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(findUsersRepositoryStub, 'find');

    await sut.update({ id: '1-abc123' });

    expect(findSpy).toHaveBeenCalledWith({ id: '1-abc123' });
    expect(findSpy).toHaveBeenCalledTimes(1);
  });

  test('Should throw UserNotFoundError if user not found', async () => {
    const { sut, findUsersRepositoryStub } = makeSut();

    jest
      .spyOn(findUsersRepositoryStub, 'find')
      .mockReturnValueOnce(new Promise((resolve) => resolve([])));

    await expect(sut.update({ id: 'non-existing-id' })).rejects.toThrow(
      UserNotFoundError,
    );
  });

  test('Should call UpdateUserRepository with correct values', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateUserRepositoryStub, 'update');

    await sut.update({
      id: '1-abc123',
      name: 'Updated Name',
      email: 'updated@gmail.com',
    });

    expect(updateSpy).toHaveBeenCalledWith({
      id: '1-abc123',
      name: 'Updated Name',
      email: 'updated@gmail.com',
    });
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  test('Should call MessageBroker with correct topic and message', async () => {
    const { sut, messageBrokerStub } = makeSut();
    const sendSpy = jest.spyOn(messageBrokerStub, 'sendMessage');

    await sut.update({
      id: '1-abc123',
      name: 'Updated Name',
      email: 'updated@gmail.com',
    });

    expect(sendSpy).toHaveBeenCalledWith({
      topicName: 'updated_user',
      message: fakeUser,
    });
  });

  test('Should throw if UpdateUserRepository throws', async () => {
    const { sut, updateUserRepositoryStub } = makeSut();

    jest
      .spyOn(updateUserRepositoryStub, 'update')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.update({
      id: '1-abc123',
      name: 'Updated Name',
    });

    await expect(promise).rejects.toThrow();
  });

  test('Should return updated user on success', async () => {
    const { sut } = makeSut();

    const result = await sut.update({
      id: '1-abc123',
      name: 'Updated Name',
      email: 'updated@gmail.com',
    });

    expect(result).toEqual(fakeUser);
  });
});
