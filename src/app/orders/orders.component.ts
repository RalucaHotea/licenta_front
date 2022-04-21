import { OrderStatus } from './../enums/order-status.enum';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';
import { OrderService } from '../services/order-service/order.service';
import { ProductService } from '../services/product-service/product.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<Order>();
  orders: Order[] = [] as Order[];
  loggedUser: User = {} as User;
  orderStatus = OrderStatus;

  displayedColumns: string[] = [
    'date',
    'customerName',
    'total',
    'status',
    'orderDetails',
  ];
  headerInputs: string[] = ['input-date', 'input-customer', 'input-total'];

  constructor(
    private orderService: OrderService,
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
        if (user.roleType == 1) {
          this.orderService.getOrdersByUserId(user.id).subscribe((orders) => {
            this.orders = orders;
            this.dataSource.data = orders;
          });
        } else if (user.roleType == 2) {
          this.orderService.getAllOrders().subscribe((orders) => {
            this.orders = orders;
            this.dataSource.data = orders;
          });
        } else if (user.roleType == 3) {
          this.orderService
            .getOrdersByUserOfficeLocation(user.id)
            .subscribe((orders) => {
              console.log(orders);
              this.orders = orders;
              this.dataSource.data = orders;
            });
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
}
