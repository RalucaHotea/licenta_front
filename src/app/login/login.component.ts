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
  model: any = {};
  admins = [
    'ROC2CLJ',
    'HOG1CLJ',
    'VRD1CLJ',
    'SIO1CLJ',
    'RUE1CLJ',
    'TMD4CLJ',
    'MSO3CLJ',
    'TOH4CLJ',
  ];
  isAdmin = false;
  isCheckboxChecked = false;
  customUsername = '';

  constructor(
    public authService: AuthenticationService,
    private eventEmitterService: EventEmitterService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.login();
    this.eventEmitterService.getEmitter('onLogIn').subscribe((username) => {
      this.ntUser = username;
      if (this.admins.includes(username)) {
        this.isAdmin = true;
      }
    });
  }

  logIn() {
    localStorage.setItem('loggedUser', this.ntUser);
    this.router.navigate(['/home']);
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  onClickCheckbox(event) {
    if (event.target.checked) {
      this.isCheckboxChecked = true;
    } else {
      this.isCheckboxChecked = false;
    }
  }

  onKey(event) {
    this.customUsername = event.target.value;
  }

  customLogin() {
    this.authService.customLogin(this.customUsername);
    this.eventEmitterService.getEmitter('onCustomLogIn').subscribe((_) => {
      localStorage.setItem('loggedUser', this.customUsername);
      this.router.navigate(['/home']);
      console.log('customLogin');
    });
  }
}
