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

  displayedColumns: string[] = ['name', 'price', 'quantity'];
  headerInputs: string[] = ['input-name', 'input-price', 'input-quantity'];
  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.items = this.cartService.getItems();
    this.dataSource.data = this.items;
  }
}
