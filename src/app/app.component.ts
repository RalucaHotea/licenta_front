import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {
  NavigationEnd,
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import { EventEmitterService } from './services/event-emitter-service/event-emitter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Bosch Store';
  showOverlay = true;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthenticationService,
    private router: Router,
    private eventEmitterService: EventEmitterService
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
      if (event instanceof NavigationEnd) {
        eventEmitterService.getEmitter('onRouteChanged').emit(event.url);
      }
    });

    this.matIconRegistry
      .addSvgIcon(
        'home-light',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          './assets/home-light.svg'
        )
      )
      .addSvgIcon(
        'arrow-right',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          './assets/arrow-right.svg'
        )
      )
      .addSvgIcon(
        'arrow-right-blue',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          './assets/arrow-right-blue.svg'
        )
      )
      .addSvgIcon(
        'down-small',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          './assets/down-small.svg'
        )
      )
      .addSvgIcon(
        'address-book',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          './assets/address-book.svg'
        )
      )
      .addSvgIcon(
        'products',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          './assets/my-products.svg'
        )
      )
      .addSvgIcon(
        'link',
        this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/link.svg')
      )
      .addSvgIcon(
        'download',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          './assets/download.svg'
        )
      )
      .addSvgIcon(
        'hourglass-white',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          './assets/hourglass-white.svg'
        )
      )
      .addSvgIcon(
        'alert-success-white',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          './assets/alert-success-white.svg'
        )
      )
      .addSvgIcon(
        'flag-white',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          './assets/flag-white.svg'
        )
      )
      .addSvgIcon(
        'close',
        this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/close.svg')
      )
      .addSvgIcon(
        'products',
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          './assets/my-product.svg'
        )
      )
      .addSvgIcon(
        'add',
        this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/add.svg')
      )
      .addSvgIcon(
        'user',
        this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/user.svg')
      );
  }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      localStorage.removeItem('token');
    }
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.showOverlay = true;
    }
    if (event instanceof NavigationEnd) {
      this.showOverlay = false;
    }
    if (event instanceof NavigationCancel) {
      this.showOverlay = false;
    }
    if (event instanceof NavigationError) {
      this.showOverlay = false;
    }
  }
}
