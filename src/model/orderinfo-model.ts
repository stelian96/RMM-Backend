import { Menu } from "./menu-model";
import { Indentifiable, IdType } from "./shared-types";

export interface IOrderInfo extends Indentifiable {
  username: string;
  userFullname: string;
  address: string;
  phone: string;
  orderedItems: Menu[];
  date: Date;
  totalPrice: string;
  status: Status[];
}
export enum Status {
  ACTIVE,
  DELIVERED,
  CANCELED,
}

export class OrderInfo implements IOrderInfo {
  static typeId = "OrderInfo";
  constructor(
    public _id: IdType,
    public username: string,
    public userFullname: string,
    public address: string,
    public phone: string,
    public orderedItems: Menu[],
    public date: Date,
    public totalPrice: string,
    public status: Status[] = [Status.ACTIVE]
  ) {}
}
