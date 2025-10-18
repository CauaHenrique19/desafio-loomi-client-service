import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

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
    private readonly buildFindUsersController: BuildFindUsersController,
    private readonly buildCreateUserController: BuildCreateUserController,
    private readonly buildUpdateUserController: BuildUpdateUserController,
    private readonly buildDeleteUserController: BuildDeleteUserController,
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

  @Patch(':id/profile-picture')
  @UseInterceptors(FileInterceptor('picture'))
  async updateProfilePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ): Promise<void> {
    const result = await controllerAdapter(
      this.buildUpdateUserPictureController.build(),
      { id, picture: { mimeType: file.mimetype, value: file.buffer } },
    );
    response.status(result.statusCode).json(result);
  }
}
