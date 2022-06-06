import { ProductService } from './../../services/product-service/product.service';
import { RoleType } from './../../enums/role-type.enum';
import { User } from './../../models/user.model';
import { AuthenticationService } from './../../services/authentication-service/authentication.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Output() closeSidebarButton = new EventEmitter<void>();
  loggedUser: User = {} as User;
  isOptionValid = false;
  isStatsValid = false;
  isSidebarActive = false;

  constructor(
    public authService: AuthenticationService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.productService
      .getUserByUserUsername(localStorage.getItem('username'))
      .subscribe((user) => {
        this.loggedUser = user;
        if (user.roleType == RoleType.Admin) {
          this.isOptionValid = true;
        }
        if (
          user.roleType == RoleType.Admin ||
          user.roleType == RoleType.LogisticsResp
        ) {
          this.isStatsValid = true;
        }
      });
    this.loggedUser = this.authService.getLoggedUser();
    this.isSidebarActive == this.authService.loggedIn();
  }

  closeButtonClicked() {
    this.closeSidebarButton.emit();
    this.isSidebarActive = !this.isSidebarActive;
  }
}
