import { User } from 'src/app/models/user.model';
import { AddOrder } from './../../models/add-order.model';
import { CartItem } from 'src/app/models/cart-item.model';
import { PickupPoint } from './../../models/pickup-point.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = environment.apiUrl + 'Order';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private options = { headers: this.headers, withCredentials: true };

  constructor(private http: HttpClient) {}

  addOrder(order: Order): Promise<number> {
    const body = JSON.stringify(order);
    return this.http
      .post<number>(this.baseUrl + '/AddOrder', body, this.options)
      .toPromise();
  }

  createOrder(order: AddOrder): Observable<AddOrder> {
    const body = JSON.stringify(order);
    return this.http.post<AddOrder>(
      this.baseUrl + '/CreateOrder',
      body,
      this.options
    );
  }

  updateOrder(order: Order): Observable<Order> {
    const body = JSON.stringify(order);
    return this.http.put<Order>(
      this.baseUrl + '/UpdateOrder',
      body,
      this.options
    );
  }

  deleteOrder(orderId: number): Observable<Order> {
    return this.http.delete<Order>(
      this.baseUrl + '/DeleteOrder?orderId=' + orderId
    );
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl + '/GetAllOrders');
  }

  getOrdersByUserOfficeLocation(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(
      this.baseUrl + '/GetOrdersByUserOfficeLocation?userId=' + userId
    );
  }

  getOrdersByUserId(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(
      this.baseUrl + '/GetOrdersByUserId?userId=' + userId
    );
  }

  getOrderByOrderId(orderId: number): Observable<Order> {
    return this.http.get<Order>(
      this.baseUrl + '/GetOrderById?orderId=' + orderId
    );
  }
  getAllPickupPoints(): Observable<PickupPoint[]> {
    return this.http.get<PickupPoint[]>(this.baseUrl + '/GetAllPickupPoints');
  }
  getPickupPointById(pickupPointId: number): Observable<PickupPoint> {
    return this.http.get<PickupPoint>(
      this.baseUrl + '/GetPickupPointById?pickupPointId=' + pickupPointId
    );
  }
}
