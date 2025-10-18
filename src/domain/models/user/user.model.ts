import { StatusEnum } from '@client-service/domain/enums';

export interface UserModel {
  id: string;
  name: string;
  email: string;
  address: string;
  bankAccount: string;
  digit: string;
  status: StatusEnum;
  createdAt: Date;
  deletedAt?: Date;
}
