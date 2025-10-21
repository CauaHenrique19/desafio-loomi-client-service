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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

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
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
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

  @ApiInternalServerErrorResponse({
    description: 'Erro inesperado na execução',
  })
  @ApiNotFoundResponse({
    description: 'Nenhum usuário encontrado',
  })
  @ApiOkResponse({
    description: 'Usuário encontrado com id',
    isArray: true,
    example: {
      statusCode: 200,
      body: [
        {
          id: 'string',
          name: 'string',
          email: 'string',
          address: 'string',
          bankAccount: 'string',
          digit: 'string',
          pictureUrl: 'string',
          pictureKey: 'string',
          status: 'ACTIVE',
          createdAt: 'Date',
          deletedAt: 'Date',
        },
      ],
    },
  })
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

  @ApiBody({
    schema: {
      example: {
        name: 'Cauã Henrique',
        email: 'cauah123@gmail.com',
        address: 'Rua Doc 15, Rio de Janeiro',
        bankAccount: '123456',
        digit: '1',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro inesperado na execução',
  })
  @ApiBadRequestResponse({
    description: 'Usuário existente na base',
  })
  @ApiCreatedResponse({
    description: 'Usuário criado',
    example: {
      statusCode: 201,
      body: {
        id: 'string',
        name: 'string',
        email: 'string',
        address: 'string',
        bankAccount: 'string',
        digit: 'string',
        pictureUrl: 'string',
        pictureKey: 'string',
        status: 'ACTIVE',
        createdAt: 'Date',
        deletedAt: 'Date',
      },
    },
  })
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

  @ApiBody({
    schema: {
      example: {
        name: 'Cauã Henrique',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro inesperado na execução',
  })
  @ApiBadRequestResponse({
    description: 'Usuário existente na base',
  })
  @ApiOkResponse({
    description: 'Usuário atualizado',
    example: {
      statusCode: 200,
      body: {
        id: 'string',
        name: 'string',
        email: 'string',
        address: 'string',
        bankAccount: 'string',
        digit: 'string',
        pictureUrl: 'string',
        pictureKey: 'string',
        status: 'ACTIVE',
        createdAt: 'Date',
        deletedAt: 'Date',
      },
    },
  })
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

  @ApiInternalServerErrorResponse({
    description: 'Erro inesperado na execução',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado na base',
  })
  @ApiNoContentResponse({
    description: 'Usuário deletado',
  })
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

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        picture: {
          type: 'string',
          format: 'binary',
          example: 'foto_perfil.png',
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Erro inesperado na execução',
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado na base',
  })
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
