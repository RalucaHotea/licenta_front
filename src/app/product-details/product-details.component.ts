import { CartService } from './../services/cart-service/cart.service';
import { Product } from './../models/product.model';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product-service/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product = {} as Product;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProductDetails();
  }

  loadProductDetails() {
    this.productService
      .getProductById(this.route.snapshot.params.id)
      .subscribe((product) => (this.product = product));
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
