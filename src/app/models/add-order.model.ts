import { CartItem } from 'src/app/models/cart-item.model';
import { Order } from './order.model';
export interface AddOrder {
  order: Order;
  items: CartItem[];
}
