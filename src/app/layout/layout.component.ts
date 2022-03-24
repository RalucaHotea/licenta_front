import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { EventEmitterService } from '../services/event-emitter-service/event-emitter.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  isVisible = false;
  isSidebarToggled = false;
  isSidebarActive = false;
  url: any;

  constructor(
    private router: Router,
    private eventEmitterService: EventEmitterService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
        if (this.url == '/login') {
          this.isSidebarActive = false;
        } else this.isSidebarActive = true;
      }
    });
  }

  ngOnInit() {
    this.eventEmitterService.getEmitter('onRouteChanged').subscribe((route) => {
      if (route == '/login' || route == '/') {
        this.isVisible = false;
      } else {
        this.isVisible = true;
      }
    });
  }
}
