import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { EventEmitterService } from '../event-emitter-service/event-emitter.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { RoleType } from 'src/app/enums/role-type.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  authUrl = environment.iisUrl + 'Authentication/';
  decodedToken: any;
  loggedUser: User = {} as User;

  constructor(
    private httpClient: HttpClient,
    private eventEmitter: EventEmitterService
  ) {}

  login() {
    const headerDict = {
      'Content-Type': 'application/json',
      //'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin':
        'https://localhost:44372/api/Authentication/login',
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
      withCredentials: true,
    };

    this.httpClient
      .get<User>(this.authUrl + 'login', requestOptions)
      .subscribe((user) => {
        this.loggedUser = user;
        if (this.loggedUser != undefined) {
          localStorage.setItem('username', this.loggedUser.username);
          localStorage.setItem('role', this.loggedUser.roleType.toString());
          localStorage.setItem('name', this.loggedUser.name);
          localStorage.setItem('email', this.loggedUser.email);
          localStorage.setItem('group', this.loggedUser.group);
          localStorage.setItem(
            'totalBenefit',
            this.loggedUser.totalBenefit.toString()
          );
        }
        this.eventEmitter.getEmitter('onLogIn').emit(this.loggedUser.username);
      });
  }

  customLogin(customUsername: string) {
    const headerDict = {
      'Content-Type': 'application/json',
      //'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': 'localhost:44386/api/Authentication/login',
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
      withCredentials: true,
    };

    this.httpClient
      .get<User>(
        this.authUrl + 'loginTest?currentUsernameTest=' + customUsername,
        requestOptions
      )
      .subscribe((user) => {
        this.loggedUser = user;
        if (this.loggedUser != undefined) {
          localStorage.setItem('username', this.loggedUser.username);
          localStorage.setItem('role', this.loggedUser.roleType.toString());
          localStorage.setItem('name', this.loggedUser.name);
          localStorage.setItem('email', this.loggedUser.email);
          localStorage.setItem('group', this.loggedUser.group);
          localStorage.setItem(
            'totalBenefit',
            this.loggedUser.totalBenefit.toString()
          );
        }
        this.eventEmitter
          .getEmitter('onCustomLogIn')
          .emit(this.loggedUser.username);
      });
  }

  loggedIn() {
    const username = localStorage.getItem('loggedUser');
    if (username == null) {
      return false;
    }
    return true;
  }

  getLoggedUser() {
    return this.loggedUser;
  }

  getLoggedUserUserName(): string {
    return localStorage.getItem('username');
  }

  getLoggedUserRole(): RoleType {
    console.log(RoleType[localStorage.getItem('role')]);
    return RoleType[localStorage.getItem('role')];
  }

  getTotalBenefit(): number {
    return Number(localStorage.getItem('totalBenefit'));
  }

  getLoggedUserName(): string {
    return localStorage.getItem('name');
  }

  getLoggedUserEmail(): string {
    return localStorage.getItem('email');
  }

  getRole(): RoleType {
    return RoleType[localStorage.getItem('roleType')];
  }

  getLoggedUserGroup(): string {
    return localStorage.getItem('group');
  }
}
