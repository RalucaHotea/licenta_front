import { EmailService } from './../services/email-service/email.service';
import { PickupPoint } from './../models/pickup-point.model';
import { OrderService } from './../services/order-service/order.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from '../models/order.model';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderStatus } from '../enums/order-status.enum';
import { MatTableDataSource } from '@angular/material/table';
import { OrderItem } from '../models/order-item.model';
import { User } from '../models/user.model';
import { ProductService } from '../services/product-service/product.service';
import { MessageBarComponent } from '../shared/message-bar/message-bar.component';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  @ViewChild('messageBar') messageBar = {} as MessageBarComponent;
  order: Order = {} as Order;
  dataSource = new MatTableDataSource<OrderItem>();
  items: OrderItem[] = [] as OrderItem[];
  pickupPoint: PickupPoint = {} as PickupPoint;
  loggedUser: User = {} as User;
  formErrors: string[] = [] as string[];
  formSuccesses: string[] = [] as string[];

  displayedColumns: string[] = ['image', 'name', 'price', 'quantity', 'total'];
  headerInputs: string[] = ['input-name', 'input-price', 'input-quantity'];

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this.productService
      .getUserByUserUsername(localStorage.getItem('username'))
      .subscribe((user) => {
        this.loggedUser = user;
      });
    this.orderService
      .getOrderByOrderId(this.route.snapshot.params.id)
      .subscribe((order) => {
        this.order = order;
        this.dataSource.data = order.items;
        this.items = order.items;
        this.orderService
          .getPickupPointById(order.pickupPointId)
          .subscribe((point) => {
            this.pickupPoint = point;
          });
      });
  }

  shipClicked() {
    this.order.status = OrderStatus.Shipped;
    this.order.shippingDate = new Date();
    this.orderService.updateOrder(this.order).subscribe();
    this.router.navigate(['/products']);
  }

  confirmReceiptClicked() {
    this.order.status = OrderStatus.Delivered;
    this.order.receivingDate = new Date();
    let emailMessage =
      'Your order arrived. You can pick it up in the lobby of ' +
      this.pickupPoint.name +
      ' in ' +
      this.pickupPoint.city +
      ' , ' +
      this.pickupPoint.country;
    this.orderService.updateOrder(this.order).subscribe(() => {
      this.emailService.sendEmail(emailMessage, 'Package Received').subscribe();
    });
    this.router.navigate(['/products']);
  }

  completeOrderClicked() {
    this.order.status = OrderStatus.Complete;
    this.order.pickupDate = new Date();
    this.orderService.updateOrder(this.order).subscribe();
  }

  removeOrder() {
    this.orderService.deleteOrder(this.order.id).subscribe(
      () => {
        this.messageBar.addSuccessTimeOut('Order Deleted Successfully');
        this.router.navigate(['/orders']);
      },
      () => {
        this.messageBar.addErrorTimeOut('Operation was unsuccessful');
      }
    );
  }
}
