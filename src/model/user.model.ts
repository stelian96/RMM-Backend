import { Indentifiable, IdType } from "./shared-types";

export interface IUser extends Indentifiable {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  roles: Role[];
}

export enum Role {
    CUSTOMER, MANAGER, ADMIN
}

export class User implements IUser {
  static typeId = "User";
  constructor(
    public _id: IdType,
    public fullName: string,
        public username: string,
        public email: string,
        public password: string,
        public phone: string,
        public address: string,
        public roles: Role[] = [Role.CUSTOMER]
  ) {}
}
