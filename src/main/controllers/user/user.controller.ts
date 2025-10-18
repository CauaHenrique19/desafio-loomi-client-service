import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';

import { controllerAdapter } from '@client-service/main/adapters/controller.adpter';
import {
  BuildCreateUserController,
  BuildDeleteUserController,
  BuildFindUsersController,
  BuildUpdateUserController,
  BuildUpdateUserPictureController,
} from '@client-service/main/factories/controllers';
import {
  CreateUserDTO,
  UpdateUserDTO,
} from '@client-service/main/controllers/user/dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject(BuildFindUsersController.name)
    private readonly buildFindUsersController: BuildFindUsersController,

    @Inject(BuildCreateUserController.name)
    private readonly buildCreateUserController: BuildCreateUserController,

    @Inject(BuildUpdateUserController.name)
    private readonly buildUpdateUserController: BuildUpdateUserController,

    @Inject(BuildDeleteUserController.name)
    private readonly buildDeleteUserController: BuildDeleteUserController,

    @Inject(BuildUpdateUserPictureController.name)
    private readonly buildUpdateUserPictureController: BuildUpdateUserPictureController,
  ) {}

  @Get('/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async find(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    const result = await controllerAdapter(
      this.buildFindUsersController.build(),
      { id },
    );
    response.status(result.statusCode).json(result);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(
    @Body() body: CreateUserDTO,
    @Res() response: Response,
  ): Promise<void> {
    const result = await controllerAdapter(
      this.buildCreateUserController.build(),
      body,
    );
    response.status(result.statusCode).json(result);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDTO,
    @Res() response: Response,
  ): Promise<void> {
    const result = await controllerAdapter(
      this.buildUpdateUserController.build(),
      { id, ...body },
    );
    response.status(result.statusCode).json(result);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async delete(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<void> {
    const result = await controllerAdapter(
      this.buildDeleteUserController.build(),
      { id },
    );
    response.status(result.statusCode).json(result);
  }
}
