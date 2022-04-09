import { CartItem } from './cart-item.model';
export interface Order {
  userId: number;
  approvalNumber: string;
  billNumber: string;
  items: Array<CartItem>;
}
