import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';

import { controllerAdapter } from '@client-service/main/adapters/controller.adpter';
import {
  BuildCreateUserController,
  BuildFindUsersController,
} from '@client-service/main/factories/controllers';
import { CreateUserDTO } from '@client-service/main/controllers/user/dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly buildFindUsersController: BuildFindUsersController,
    private readonly buildCreateUserController: BuildCreateUserController,
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
}
