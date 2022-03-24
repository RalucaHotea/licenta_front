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
  isSidebarActive = false;

  constructor(public authService: AuthenticationService) {}

  ngOnInit() {
    this.loggedUser = this.authService.getLoggedUser();
    this.isSidebarActive == this.authService.loggedIn();
  }

  closeButtonClicked() {
    this.closeSidebarButton.emit();
    this.isSidebarActive = !this.isSidebarActive;
  }
}
