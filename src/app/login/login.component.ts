import { User } from './../models/user.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { EventEmitterService } from '../services/event-emitter-service/event-emitter.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  ntUser: string = '';
  loggedUser: User = {} as User;
  isLoaded = false;

  constructor(
    public authService: AuthenticationService,
    private eventEmitterService: EventEmitterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.login();
    this.eventEmitterService.getEmitter('onLogIn').subscribe((username) => {
      this.ntUser = username;
    });
  }

  logIn() {
    localStorage.setItem('loggedUser', this.ntUser);
    this.router.navigate(['/home']);
  }

  loggedIn() {
    return this.authService.loggedIn();
  }
}
