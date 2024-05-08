import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import {
  IUser,
  IUserEntity,
  UserCreateDto,
  UserModel,
} from '../../../../@common/src';
import { User } from './user.entity';

import { UserNotificationService } from './user.notification.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: MongoRepository<User>,
    private notificatrionService: UserNotificationService,
  ) {}

  async create(user: UserCreateDto) {
    const exists = await this.getByEmail(user.email);

    if (exists) {
      throw new ConflictException('User already exists');
    }

    const entity = new User(UserCreateDto.toEntity(user));
    const newUser = await this.userRepository.save(entity);

    this.notificatrionService.sendWelcomeEmail(
      newUser.email,
      newUser.firstName,
      newUser.lastName,
    );

    return UserModel.fromEntity(newUser as unknown as IUserEntity);
  }

  getByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getAvatar(_id: string): Promise<Pick<IUser, 'avatar'>> {
    const user = await this.getById(_id);

    return { avatar: user.avatar };
  }

  async deleteAvatar(_id: string): Promise<void> {
    const user = await this.getEntityById(_id);

    await this.userRepository.save({ ...user, avatar: null });
  }

  async getById(_id: string): Promise<IUser> {
    const res = await this.getEntityById(_id);

    return UserModel.fromEntity(res);
  }

  private async getEntityById(_id: string): Promise<IUserEntity> {
    const res = await this.userRepository.findOne({
      where: { _id: new ObjectId(_id) },
    });

    if (!res) {
      throw new NotFoundException('User not found');
    }

    return res as unknown as IUserEntity;
  }
}
