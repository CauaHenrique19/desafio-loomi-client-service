import { NestFactory } from '@nestjs/core';

import { ClientServiceModule } from './client-service.module';
import { CONFIG } from 'src/config';

async function bootstrap() {
  const app = await NestFactory.create(ClientServiceModule);
  app.enableCors();
  app.setGlobalPrefix('/api/');

  await app.listen(CONFIG.PORT);
}
bootstrap();
