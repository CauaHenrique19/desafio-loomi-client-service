import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { CONFIG } from 'src/config';
import { ClientServiceModule } from './client-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ClientServiceModule);
  app.enableCors();
  app.setGlobalPrefix('/api/');

  const config = new DocumentBuilder()
    .setTitle('Client Service')
    .setDescription(
      'API responsável por gerenciar informações dos clientes do banco',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(CONFIG.PORT);
}
bootstrap();
