import {
  CreateUserRepository,
  FindUserRepository,
} from '@client-service/data/protocols/db';
import { MessageBroker } from '@client-service/data/protocols/message-broker/message-broker';
import { CreateUser } from '@client-service/data/usecases';
import { StatusEnum } from '@client-service/domain/enums';
import { UserAlreadyExists } from '@client-service/domain/errors';
import { UserModel } from '@client-service/domain/models';

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

const makeFindUserRepository = (): FindUserRepository => {
  class FindUserRepositoryStub implements FindUserRepository {
    async findOne(): Promise<FindUserRepository.Result> {
      return null;
    }
  }
  return new FindUserRepositoryStub();
};

const makeCreateUserRepository = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    async create(): Promise<CreateUserRepository.Result> {
      return new Promise((resolve) => resolve(fakeUser));
    }
  }
  return new CreateUserRepositoryStub();
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
  sut: CreateUser;
  findUserRepositoryStub: FindUserRepository;
  createUserRepositoryStub: CreateUserRepository;
  messageBrokerStub: MessageBroker;
}

const makeSut = (): SutTypes => {
  const findUserRepositoryStub = makeFindUserRepository();
  const createUserRepositoryStub = makeCreateUserRepository();
  const messageBrokerStub = makeMessageBroker();
  const sut = new CreateUser(
    findUserRepositoryStub,
    createUserRepositoryStub,
    messageBrokerStub,
  );
  return {
    sut,
    findUserRepositoryStub,
    createUserRepositoryStub,
    messageBrokerStub,
  };
};

describe('CreateUser UseCase', () => {
  test('Should call FindUserRepository with correct email', async () => {
    const { sut, findUserRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(findUserRepositoryStub, 'findOne');
    await sut.create({ email: 'test@gmail.com' } as any);
    expect(findSpy).toHaveBeenCalledWith({ email: 'test@gmail.com' });
  });

  test('Should throw UserAlreadyExists if user already exists', async () => {
    const { sut, findUserRepositoryStub } = makeSut();
    jest
      .spyOn(findUserRepositoryStub, 'findOne')
      .mockReturnValueOnce(new Promise((resolve) => resolve(fakeUser)));

    await expect(
      sut.create({ email: 'test@gmail.com' } as any),
    ).rejects.toThrow(UserAlreadyExists);
  });

  test('Should call CreateUserRepository with correct values', async () => {
    const { sut, createUserRepositoryStub } = makeSut();
    const createSpy = jest.spyOn(createUserRepositoryStub, 'create');

    await sut.create({
      name: 'Cauã',
      email: 'test@gmail.com',
      address: 'Rua Mock 123, RJ',
      bankAccount: '123456',
      digit: '1',
      pictureKey: 'mock-key',
      pictureUrl: 'mock-url',
    });

    expect(createSpy).toHaveBeenCalled();
  });

  test('Should call MessageBroker with correct topic and message', async () => {
    const { sut, messageBrokerStub } = makeSut();
    const sendMessageSpy = jest.spyOn(messageBrokerStub, 'sendMessage');

    await sut.create({
      name: 'Cauã',
      email: 'test@gmail.com',
      address: 'Rua Mock 123, RJ',
      bankAccount: '123456',
      digit: '1',
      pictureKey: 'mock-key',
      pictureUrl: 'mock-url',
    });

    expect(sendMessageSpy).toHaveBeenCalledWith({
      topicName: 'created_user',
      message: fakeUser,
    });
  });

  test('Should return created user on success', async () => {
    const { sut } = makeSut();
    const result = await sut.create({
      name: 'Cauã',
      email: 'test@gmail.com',
      address: 'Rua Mock 123, RJ',
      bankAccount: '123456',
      digit: '1',
      pictureKey: 'mock-key',
      pictureUrl: 'mock-url',
    });
    expect(result).toEqual(fakeUser);
  });
});
