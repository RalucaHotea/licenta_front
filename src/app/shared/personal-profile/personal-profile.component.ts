import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-personal-profile',
  templateUrl: './personal-profile.component.html',
  styleUrls: ['./personal-profile.component.css'],
})
export class PersonalProfileComponent implements OnInit {
  loggedUser: User = {} as User;

  constructor(public authService: AuthenticationService) {}

  ngOnInit(): void {
    this.loggedUser = this.authService.getLoggedUser();
  }
}
