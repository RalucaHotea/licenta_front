import { Product } from './../models/product.model';
import { CartService } from './../services/cart-service/cart.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  items: Product[] = [] as Product[];
  dataSource = new MatTableDataSource<Product>();
  quantity: number = 1;

  displayedColumns: string[] = [
    'name',
    'price',
    'quantity',
    'total',
    'removeItem',
  ];
  headerInputs: string[] = ['input-name', 'input-price', 'input-quantity'];
  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.items = this.cartService.getItems();
    this.dataSource.data = this.items;
  }

  decreaseQuantity() {
    this.quantity = this.quantity - 1;
  }

  increaseQuantity() {
    this.quantity = this.quantity + 1;
  }

  removeItem(product) {
    this.cartService.removeItem(product);
  }
}
