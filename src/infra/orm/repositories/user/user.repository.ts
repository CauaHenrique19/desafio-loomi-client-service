import { Inject } from '@nestjs/common';
import { EntityTarget, FindOptionsWhere, Repository } from 'typeorm';

import {
  CreateUserRepository,
  DeleteUserRepository,
  FindUserRepository,
  FindUsersRepository,
  UpdateUserRepository,
} from '@client-service/data/protocols/db';
import { User } from '@client-service/infra/orm/entities';
import { USER_REPOSITORY } from '@client-service/infra/orm/typeorm/typeorm.repositories';
import { AppDataSource } from '@client-service/infra/orm/typeorm/data-source';
import { StatusEnum } from '@client-service/domain/enums';

export class UserRepository
  implements
    CreateUserRepository,
    FindUsersRepository,
    FindUserRepository,
    UpdateUserRepository,
    DeleteUserRepository
{
  private readonly userRepository: Repository<User>;

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly User: EntityTarget<User>,
  ) {
    this.userRepository = AppDataSource.getRepository(this.User);
  }

  find(
    parameters?: FindUsersRepository.Parameters,
  ): Promise<FindUsersRepository.Result> {
    const where: FindOptionsWhere<User> = {};

    if (parameters?.id) {
      where.id = parameters.id;
    }

    return this.userRepository.find({
      where,
    });
  }

  findOne(
    parameters?: FindUserRepository.Parameters,
  ): Promise<FindUserRepository.Result> {
    const where: FindOptionsWhere<User> = {};

    if (parameters?.email) {
      where.email = parameters.email;
    }

    return this.userRepository.findOne({
      where,
    });
  }

  async create(
    parameters: CreateUserRepository.Parameters,
  ): Promise<CreateUserRepository.Result> {
    const user = new User();
    Object.assign(user, parameters);

    await this.userRepository.save(user);
    return user;
  }

  async update(
    parameters: UpdateUserRepository.Parameters,
  ): Promise<UpdateUserRepository.Result> {
    return this.userRepository.save(parameters);
  }

  async delete(
    parameters: DeleteUserRepository.Parameters,
  ): Promise<DeleteUserRepository.Result> {
    await this.userRepository.update(
      {
        id: parameters.id,
      },
      {
        status: StatusEnum.INACTIVE,
      },
    );
  }
}
