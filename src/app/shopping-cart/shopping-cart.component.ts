import { Product } from './../models/product.model';
import { CartService } from './../services/cart-service/cart.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  items: Product[] = [] as Product[];
  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.items = this.cartService.getItems();
    console.log(this.items);
  }
}
