import { OrderStatus } from './../enums/order-status.enum';
import { CartItem } from './cart-item.model';
import { OrderItem } from './order-item.model';
import { User } from './user.model';
export interface Order {
  id: number;
  userId: number;
  status: OrderStatus;
  approvalNumber: string;
  billNumber: string;
  pickupPointId: number;
  items: Array<OrderItem>;
  user: User;
  totalPrice: number;
  submittedAt: Date;
  shippedDate: Date;
  pickupDate: Date;
  receivingDate: Date;
}
