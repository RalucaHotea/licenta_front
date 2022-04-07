import { Product } from './../../models/product.model';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CartItem } from 'src/app/models/cart-item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = environment.apiUrl + 'Product';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private options = { headers: this.headers, withCredentials: true };

  constructor(private http: HttpClient) {}

  addToCart(item: CartItem) {
    const body = JSON.stringify(item);
    return this.http.post<CartItem>(
      this.baseUrl + '/AddItemToCart',
      body,
      this.options
    );
  }

  getItemList(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(
      this.baseUrl + '/GetCartItemsByUserId?userId=' + userId
    );
  }

  removeItem(itemId: number) {
    return this.http.delete(this.baseUrl + '/DeleteCartItem?itemId=' + itemId);
  }
}
