import { EmailService } from './../services/email-service/email.service';
import { AddOrder } from './../models/add-order.model';
import { OrderItem } from './../models/order-item.model';
import { PickupPoint } from './../models/pickup-point.model';
import { OrderService } from './../services/order-service/order.service';
import { OrderStatus } from './../enums/order-status.enum';
import { CartItem } from './../models/cart-item.model';
import { Product } from './../models/product.model';
import { CartService } from './../services/cart-service/cart.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { User } from '../models/user.model';
import { ProductService } from '../services/product-service/product.service';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Order } from '../models/order.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  items: CartItem[] = [] as CartItem[];
  orderItems: OrderItem[] = [] as OrderItem[];
  products: Product[] = [] as Product[];
  dataSource = new MatTableDataSource<CartItem>();
  quantity: number = 1;
  loggedUser: User = {} as User;
  pickupPoints: PickupPoint[] = [] as PickupPoint[];
  selectedPickupPoint = '';
  orderId: number;
  formErrors: string[] = [] as string[];

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
    private authService: AuthenticationService,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private emailService: EmailService
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
    this.orderService.getAllPickupPoints().subscribe((pickupPoints) => {
      this.pickupPoints = pickupPoints;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  selectPickupPoint(event: Event) {
    this.selectedPickupPoint = (event.target as HTMLSelectElement).value;
  }

  decreaseQuantity(itemId: number) {
    this.cartService.getCartItemById(itemId).subscribe((item) => {
      if (item.quantity == 0) {
        this.cartService.removeItem(item.id);
      }
      var newItem = {
        id: item.id,
        userId: item.userId,
        productId: item.productId,
        quantity: item.quantity - 1,
      } as CartItem;
      this.cartService.updateCartItem(newItem).subscribe(() => {
        window.location.reload();
      });
    });
    this.quantity = this.quantity - 1;
  }

  increaseQuantity(itemId) {
    this.cartService.getCartItemById(itemId).subscribe((item) => {
      var productStock = this.productService
        .getProductStockCount(item.productId)
        .subscribe((stock) => {
          if (stock >= item.quantity + 1) {
            var newItem = {
              id: item.id,
              userId: item.userId,
              productId: item.productId,
              quantity: item.quantity + 1,
            } as CartItem;
            this.cartService.updateCartItem(newItem).subscribe(() => {
              window.location.reload();
            });
            this.quantity = this.quantity + 1;
          } else {
            this.formErrors.push('Quantity is bigger than stock');
          }
        });
    });
  }

  removeItem(itemId: number) {
    this.cartService.removeItem(itemId).subscribe(() => {
      window.location.reload();
    });
  }

  async placeOrder() {
    var totalCost = this.getTotalCost();
    var benefit = this.loggedUser.totalBenefit;
    if (
      this.items.length != 0 &&
      this.selectedPickupPoint != '' &&
      benefit >= totalCost
    ) {
      const order = {
        userId: this.loggedUser.id,
        status: OrderStatus.InSubmission,
        pickupPointId: Number(this.selectedPickupPoint),
        submittedAt: new Date(),
      } as Order;

      var orderToAdd = {
        order: order,
        items: this.items,
      } as AddOrder;

      this.orderService.createOrder(orderToAdd).subscribe(() => {
        this.router.navigate(['/orders']);
        this.emailService
          .sendEmail(
            'Thank you for your order! You can check out the details in order section on our website',
            'Order Confirmation'
          )
          .subscribe();
      });
      this.cartService.clearCartByUserId(this.loggedUser.id).subscribe();
    } else {
      if (this.items.length == 0) {
        this.formErrors.push('Your cart is empty');
      } else if (this.selectedPickupPoint == '') {
        this.formErrors.push('PickupPoint is mandatory');
      } else if (benefit <= totalCost) {
        this.formErrors.push('Not enough benefit');
      }
    }
  }

  getTotalCost() {
    return this.items
      .map((t) => t.quantity * t.product.price)
      .reduce((acc, value) => acc + value, 0);
  }
}
