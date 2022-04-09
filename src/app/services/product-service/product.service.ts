import { Order } from './../../models/order.model';
import { CartItem } from 'src/app/models/cart-item.model';
import { Subcategory } from './../../models/subcategory.model';
import { Category } from './../../models/category.model';
import { Observable } from 'rxjs';
import { Product } from './../../models/product.model';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = environment.apiUrl + 'Product';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  private options = { headers: this.headers, withCredentials: true };

  constructor(private http: HttpClient) {}

  addProduct(product: Product): Observable<Product> {
    const body = JSON.stringify(product);
    return this.http.post<Product>(
      this.baseUrl + '/AddProduct',
      body,
      this.options
    );
  }

  addOrder(order: Order): Observable<Order> {
    const body = JSON.stringify(order);
    return this.http.post<Order>(
      this.baseUrl + '/AddOrder',
      body,
      this.options
    );
  }

  getUserByUserUsername(username: string): Observable<User> {
    return this.http.get<User>(
      this.baseUrl + '/GetUserByUserUsername?username=' + username
    );
  }

  updateProduct(product: Product): Observable<Product> {
    const body = JSON.stringify(product);
    return this.http.put<Product>(
      this.baseUrl + '/UpdateProduct',
      body,
      this.options
    );
  }

  updateCartItem(item: CartItem): Observable<CartItem> {
    const body = JSON.stringify(item);
    return this.http.put<CartItem>(
      this.baseUrl + '/UpdateCartItem',
      body,
      this.options
    );
  }

  deleteProduct(productId: number) {
    return this.http.delete(
      this.baseUrl + '/DeleteProduct?productId=' + productId
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl + '/GetAllProducts');
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(
      this.baseUrl + '/GetProductById?productId=' + productId
    );
  }

  getCartItemById(itemId: number): Observable<CartItem> {
    return this.http.get<CartItem>(
      this.baseUrl + '/GetCartItemById?itemId=' + itemId
    );
  }

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.baseUrl + '/GetProductByCategoryId?categoryId=' + categoryId
    );
  }

  getProductsBySubcategoryId(subcategoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.baseUrl + '/GetProductBySubcategoryId?subcategoryId=' + subcategoryId
    );
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl + '/GetAllCategories');
  }

  getAllSubcategories(): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(this.baseUrl + '/GetAllSubcategories');
  }

  getAllSubcategoriesByCategoryId(
    categoryId: number
  ): Observable<Subcategory[]> {
    return this.http.get<Subcategory[]>(
      this.baseUrl + '/GetAllSubcategoriesByCategoryId?categoryId=' + categoryId
    );
  }

  removeFile(fileName: string) {
    return this.http.delete(this.baseUrl + '/DeleteFile?fileName=' + fileName);
  }

  downloadFile(ideaId: number, fileId: number) {
    return this.http.get<Blob>(
      this.baseUrl + 'DownloadFileById?ideaId=' + ideaId + '&fileId=' + fileId,
      { observe: 'response', responseType: 'blob' as 'json' }
    );
  }
}
