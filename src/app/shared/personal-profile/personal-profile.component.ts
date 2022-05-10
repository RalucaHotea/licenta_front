import { ProductService } from './../../services/product-service/product.service';
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

  constructor(
    public authService: AuthenticationService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productService
      .getUserByUserUsername(localStorage.getItem('username'))
      .subscribe((user) => {
        this.loggedUser = user;
      });
  }
}
