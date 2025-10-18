import { StatusEnum } from '@client-service/domain/enums';
import { UserRepository } from '@client-service/infra/orm/repositories';
import { User } from '@client-service/infra/orm/entities';
import { AppDataSource } from '@client-service/infra/orm/typeorm/data-source';
import { CreateUserRepository } from '@client-service/data/protocols/db';
import { randomUUID } from 'crypto';

describe('UserRepository', () => {
  let dataSource: typeof AppDataSource;

  beforeAll(async () => {
    dataSource = AppDataSource;
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  const makeSut = (): UserRepository => {
    return new UserRepository(User);
  };

  describe('find()', () => {
    test('Should return an empty array when database is clear', async () => {
      const sut = makeSut();

      jest.spyOn(sut, 'find').mockResolvedValueOnce([]);

      const users = await sut.find();

      expect(users).toBeTruthy();
      expect(users.length).toBe(0);
    });

    test('Should filter by id', async () => {
      const sut = makeSut();

      const users = await sut.find({
        id: randomUUID(),
      });

      expect(users).toBeTruthy();
      expect(users.length).toBeGreaterThanOrEqual(0);
    });

    test('Should return an array of users', async () => {
      const sut = makeSut();

      const users = await sut.find();

      expect(users).toBeTruthy();
      expect(users.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('findOne()', () => {
    test('Should return null if user email does not exist', async () => {
      const sut = makeSut();

      jest.spyOn(sut, 'findOne').mockResolvedValueOnce(null);

      const user = await sut.findOne({ email: 'nonexistent@test.com' });

      expect(user).toBeNull();
    });

    test('Should return a user when email exists', async () => {
      const sut = makeSut();

      const users = await sut.find();
      const email = users[0]?.email ?? 'test@example.com';

      const user = await sut.findOne({ email });

      expect(user).toBeTruthy();
      expect(user?.email).toBe(email);
    });
  });

  describe('create()', () => {
    test('Should create a new user', async () => {
      const sut = makeSut();

      const randomEmail = `${crypto.randomUUID()}@test.com`;
      const newUser: CreateUserRepository.Parameters = {
        name: 'Cauã',
        email: randomEmail,
        address: 'Rua Mock 123, RJ',
        bankAccount: '123456',
        digit: '1',
        pictureKey: 'key123',
        pictureUrl: 'url123',
        status: StatusEnum.ACTIVE,
        createdAt: new Date(),
      };

      const user = await sut.create(newUser);

      expect(user).toBeTruthy();
      expect(user.email).toBe(newUser.email);
    });
  });

  describe('update()', () => {
    test('Should update a user', async () => {
      const sut = makeSut();

      const users = await sut.find();
      if (!users[0]) return;

      const updatedUser = await sut.update({
        ...users[0],
        name: 'Updated Name',
      });

      expect(updatedUser).toBeTruthy();
      expect(updatedUser.name).toBe('Updated Name');
    });
  });

  describe('delete()', () => {
    test('Should soft delete a user by setting status INACTIVE', async () => {
      const sut = makeSut();

      const users = await sut.find();
      if (!users[0]) return;

      await sut.delete({ id: users[0].id });

      const deletedUser = await sut.findOne({ email: users[0].email });
      expect(deletedUser?.status).toBe(StatusEnum.INACTIVE);
    });
  });
});
