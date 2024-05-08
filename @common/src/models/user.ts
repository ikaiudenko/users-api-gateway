import { IUser, IUserEntity } from "../types"

export class UserModel {
  static fromEntity(entity: IUserEntity): IUser {
    return {
      id: entity._id,
      email: entity.email,
      firstName: entity.firstName,
      lastName: entity.lastName,
      avatar: entity.avatar ? `data:image/png;base64,${Buffer.from(entity.avatar).toString('base64')}` : null
    }
  }
}