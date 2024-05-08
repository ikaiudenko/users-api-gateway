import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  US_NAME,
  US_EVENTS,
  UserCreateDto,
  IUser,
} from '../../../../@common/src';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject(US_NAME) private userProxyCLient: ClientProxy) {}

  createUser(user: UserCreateDto): Promise<IUser> {
    const res = this.userProxyCLient.send({ cmd: US_EVENTS.Create }, user);

    return firstValueFrom(res);
  }

  getById(id: string): Promise<IUser> {
    const res = this.userProxyCLient.send({ cmd: US_EVENTS.Get }, id);

    return firstValueFrom(res);
  }

  getAvatar(id: string): Promise<Pick<IUser, 'avatar'>> {
    const res = this.userProxyCLient.send({ cmd: US_EVENTS.GetAvatar }, id);

    return firstValueFrom(res);
  }

  deleteAvatar(id: string): void {
    this.userProxyCLient.emit(US_EVENTS.DeleteAvatar, id);
  }
}
