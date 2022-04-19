import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { RoleType } from '../enums/role-type.enum';
import { AuthenticationService } from '../services/authentication-service/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data.expectedRoles;
    const activeUserRole = this.authenticationService.getLoggedUserRole();

    if (
      this.authenticationService.loggedIn() &&
      expectedRoles.some(
        (x: RoleType) => this.authenticationService.getRole() == x
      )
    ) {
      return true;
    }

    this.router.navigate(['/home']);
  }
}
