import { PickupPoint } from './../models/pickup-point.model';
import { OrderService } from './../services/order-service/order.service';
import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order.model';
import { ActivatedRoute } from '@angular/router';
import { OrderStatus } from '../enums/order-status.enum';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  order: Order = {} as Order;
  pickupPoint: PickupPoint = {} as PickupPoint;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.orderService
      .getOrderByOrderId(this.route.snapshot.params.id)
      .subscribe((order) => {
        this.order = order;
        this.orderService
          .getPickupPointById(order.pickupPointId)
          .subscribe((point) => {
            this.pickupPoint = point;
          });
      });
  }

  shipClicked() {
    this.order.status = OrderStatus.Sent;
    this.order.shippedDate = new Date();
    this.orderService.updateOrder(this.order).subscribe();
  }

  completeOrderClicked() {
    this.order.status = OrderStatus.Complete;
    this.order.pickupDate = new Date();
    this.orderService.updateOrder(this.order).subscribe();
  }
}
