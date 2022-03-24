import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { EventEmitterService } from 'src/app/services/event-emitter-service/event-emitter.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.loggedIn();
  }
}
