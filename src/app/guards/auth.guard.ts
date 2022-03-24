import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { EventEmitterService } from '../services/event-emitter-service/event-emitter.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authenticationService: AuthenticationService,
    private eventEmitterService: EventEmitterService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authenticationService.loggedIn()) {
      this.eventEmitterService.getEmitter('onLogin')?.emit();
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
