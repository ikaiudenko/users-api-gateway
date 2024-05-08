import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { US_EVENTS, UserCreateDto } from '../../../../@common/src/index';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: US_EVENTS.Create })
  async create(@Payload() user: UserCreateDto) {
    return this.userService.create(user);
  }

  @MessagePattern({ cmd: US_EVENTS.Get })
  async getById(@Payload() id: string) {
    return this.userService.getById(id);
  }

  @MessagePattern({ cmd: US_EVENTS.GetAvatar })
  async getAvatar(@Payload() id: string) {
    return this.userService.getAvatar(id);
  }

  @EventPattern(US_EVENTS.DeleteAvatar)
  async deleteAvatar(@Payload() id: string) {
    await this.userService.deleteAvatar(id);
  }
}
