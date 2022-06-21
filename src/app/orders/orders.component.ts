import { OrderStatus } from './../enums/order-status.enum';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';
import { OrderService } from '../services/order-service/order.service';
import { ProductService } from '../services/product-service/product.service';
import { TableFilter } from '../models/table-filter.model';
import { EnumTableOption } from '../models/enum-table-option.model';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<Order>();
  orders: Order[] = [] as Order[];
  loggedUser: User = {} as User;
  orderStatus = OrderStatus;
  status: OrderStatus = {} as OrderStatus;
  selectedPage = 'InSubmission';

  displayedColumns: string[] = [
    'customerName',
    'date',
    'total',
    'status',
    'orderDetails',
  ];
  headerInputs: string[] = ['input-customer', 'input-date', 'input-total'];

  filterSelectObj: TableFilter[] = [
    {
      EnumValue: -1,
      Value: '',
      ColumnProp: 'status',
      Options: [],
    },
    {
      EnumValue: -1,
      Value: '',
      ColumnProp: 'customerName',
      Options: [],
    },
  ];

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
        this.orderService.getOrdersByUserId(user.id).subscribe((orders) => {
          this.orders = orders;
          this.dataSource.data = orders;
        });
      });
  }

  initData(orders: Order[]) {
    this.orders = orders.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    this.dataSource.data = this.orders;
    this.filterSelectObj.forEach((el) => {
      el.EnumValue = -1;
      el.Value = '';
      el.Options = this.getFilterObject(this.orders, el.ColumnProp);
    });
  }

  getFilterByColumnProp(columnProp: string): TableFilter {
    return (
      this.filterSelectObj.find((x) => x.ColumnProp === columnProp) ??
      ({} as TableFilter)
    );
  }

  getFilterObject(fullObj: any[], key: string): any[] {
    const uniqSelect: any[] = [];
    const uniqItem: any[] = [];
    fullObj.forEach((obj) => {
      if (!uniqItem.includes(obj[key])) {
        switch (key) {
          case 'status': {
            const el: EnumTableOption = {
              key: this.status[obj[key]],
              value: obj[key],
            };
            uniqSelect.push(el);
            break;
          }
          default:
            break;
        }
        uniqItem.push(obj[key]);
      }
    });
    return uniqSelect;
  }

  filterChanged() {
    this.dataSource.data = this.orders.filter((order) => {
      let result = true;
      for (const filter of this.filterSelectObj) {
        if (
          (order[filter.ColumnProp] == null && filter.Value !== '') ||
          (filter.Value !== '' &&
            !order[filter.ColumnProp]
              .toLocaleLowerCase()
              .includes(filter.Value.toLocaleLowerCase())) ||
          (filter.EnumValue != -1 &&
            order[filter.ColumnProp] != filter.EnumValue)
        ) {
          result = false;
          break;
        }
      }
      return result;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  changePage(page) {
    this.dataSource.data = [];
    this.orders = [];
    this.selectedPage = page;
    switch (page) {
      case 'InSubmission':
        this.orderService
          .getOrdersByUserId(this.loggedUser.id)
          .subscribe((orders) => {
            this.orders = orders;
            this.dataSource.data = orders;
          });
        localStorage.setItem('pageType', 'InSubmission');
        break;
      case 'Overview':
        if (this.loggedUser.roleType == 2) {
          this.orderService.getAllOrders().subscribe((orders) => {
            this.orders = orders;
            this.dataSource.data = orders;
          });
        } else if (this.loggedUser.roleType == 3) {
          this.orderService
            .getOrdersByUserOfficeLocation(this.loggedUser.id)
            .subscribe((orders) => {
              this.orders = orders;
              this.dataSource.data = orders;
            });
        }
        break;
      default:
        break;
    }
  }
}
