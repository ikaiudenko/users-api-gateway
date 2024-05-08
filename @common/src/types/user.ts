export class ICreateUser {
  email: string;
  firstName: string;
  lastName: string;
  avatar: ArrayBuffer | null;
}

export interface IUser {
  id: string;
  avatar: string | null;
  email: string;
  firstName: string;
  lastName: string;
}

export interface IUserEntity extends ICreateUser {
  _id: string;
}