import { Column, Entity, ObjectId, ObjectIdColumn, Index } from 'typeorm';
import { IUserEntity } from '../../../../@common/src';

type UserEntity = Omit<IUserEntity, '_id'>;

@Entity('users')
@Index('email', ['email'])
export class User implements UserEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, default: null })
  avatar: ArrayBuffer;

  constructor(data?: UserEntity) {
    if (data) {
      this.lastName = data.lastName;
      this.email = data.email;
      this.firstName = data.firstName;
      this.avatar = data.avatar;
    }
  }
}
