import { CartItem } from './../models/cart-item.model';
import { Product } from './../models/product.model';
import { CartService } from './../services/cart-service/cart.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { User } from '../models/user.model';
import { ProductService } from '../services/product-service/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  items: CartItem[] = [] as CartItem[];
  dataSource = new MatTableDataSource<CartItem>();
  quantity: number = 1;
  loggedUser: User = {} as User;

  displayedColumns: string[] = [
    'name',
    'price',
    'quantity',
    'total',
    'removeItem',
  ];
  headerInputs: string[] = ['input-name', 'input-price', 'input-quantity'];

  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService
      .getUserByUserUsername(localStorage.getItem('username'))
      .subscribe((user) => {
        this.loggedUser = user;
        this.cartService.getItemList(user.id).subscribe((items) => {
          this.items = items;
          this.dataSource.data = items;
        });
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  decreaseQuantity(itemId: number) {
    this.productService.getCartItemById(itemId).subscribe((item) => {
      if (item.quantity == 0) {
        this.cartService.removeItem(item.id);
      }
      var newItem = {
        id: item.id,
        userId: item.userId,
        productId: item.productId,
        quantity: item.quantity - 1,
      } as CartItem;
      this.productService.updateCartItem(newItem).subscribe(() => {
        window.location.reload();
      });
    });
    this.quantity = this.quantity - 1;
  }

  increaseQuantity(itemId) {
    this.productService.getCartItemById(itemId).subscribe((item) => {
      var newItem = {
        id: item.id,
        userId: item.userId,
        productId: item.productId,
        quantity: item.quantity + 1,
      } as CartItem;
      this.productService.updateCartItem(newItem).subscribe(() => {
        window.location.reload();
      });
    });
    this.quantity = this.quantity + 1;
  }

  removeItem(itemId: number) {
    this.cartService.removeItem(itemId).subscribe(() => {
      window.location.reload();
    });
  }

  placeOrder() {
    console.log('order');
  }

  getTotalCost() {
    return this.items
      .map((t) => t.quantity * t.product.price)
      .reduce((acc, value) => acc + value, 0);
  }
}
