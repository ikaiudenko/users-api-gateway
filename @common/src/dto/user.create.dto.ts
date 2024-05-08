import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';
import { ICreateUser, IUserEntity } from "../types/user";
import { ApiProperty } from '@nestjs/swagger';


export class UserCreateDto implements ICreateUser {
  @ApiProperty({ required: true })
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDefined()
  firstName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDefined()
  lastName: string;

  avatar: ArrayBuffer;

  constructor(dto?: ICreateUser) {
    if (dto) {
      this.email = dto.email;
      this.firstName = dto.firstName;
      this.lastName = dto.lastName;
      if (dto.avatar) {
        this.avatar = dto.avatar;
      }
    }
  }

  setAvatar(avatar: ArrayBuffer) {
    this.avatar = avatar;
  }

  
  static toEntity(dto: UserCreateDto): Omit<IUserEntity, '_id'> {
    return {
      email: dto.email,
      avatar: dto.avatar ?? null,
      firstName: dto.firstName,
      lastName: dto.lastName
    }
  }
}