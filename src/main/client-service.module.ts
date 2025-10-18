import { Module } from '@nestjs/common';

import { TypeormModule } from '@client-service/infra/orm/typeorm/typeorm.module';
import { UserModule } from '@client-service/main/controllers/user/user.module';

@Module({
  imports: [TypeormModule, UserModule],
})
export class ClientServiceModule {}
