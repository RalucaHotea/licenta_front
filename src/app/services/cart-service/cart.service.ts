import { Product } from './../../models/product.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items: Product[] = [] as Product[];

  addToCart(product: Product) {
    this.items.push(product);
    localStorage.setItem('productsList', JSON.stringify(this.items));
  }

  getProductList(): Product[] {
    return JSON.parse(localStorage.getItem('productsList'));
  }

  getItems(): Product[] {
    // return this.getProductList();
    return this.items;
  }

  removeItem(product: Product) {
    localStorage.removeItem(JSON.stringify(product));
  }

  clearCart() {
    this.items = [];
    return this.items;
  }
}
