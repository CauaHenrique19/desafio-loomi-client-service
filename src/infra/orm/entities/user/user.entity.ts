import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { UserModel } from '@client-service/domain/models';
import { StatusEnum } from '@client-service/domain/enums';

@Entity({ name: 'tb_users' })
export class User implements UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  address: string;

  @Column({ name: 'bank_account' })
  bankAccount: string;

  @Column()
  digit: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
  })
  status: StatusEnum;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
