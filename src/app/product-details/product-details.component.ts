import { CartItem } from './../models/cart-item.model';
import { CartService } from './../services/cart-service/cart.service';
import { Product } from './../models/product.model';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product-service/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthenticationService } from '../services/authentication-service/authentication.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product = {} as Product;
  items: CartItem[] = [] as CartItem[];
  loggedUser: User = {} as User;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.productService
      .getUserByUserUsername(localStorage.getItem('username'))
      .subscribe((user) => {
        this.loggedUser = user;
      });
    this.loadProductDetails();
  }

  loadProductDetails() {
    this.productService
      .getProductById(this.route.snapshot.params.id)
      .subscribe((product) => (this.product = product));
  }

  addToCart() {
    var minimumQuantity = 1;
    if (this.product.minimumQuantity != 0) {
      minimumQuantity = minimumQuantity;
    }
    const newItem = {
      id: 0,
      userId: this.loggedUser.id,
      productId: this.route.snapshot.params.id,
      quantity: minimumQuantity,
    } as CartItem;
    this.cartService.addToCart(newItem).subscribe();
  }
}
