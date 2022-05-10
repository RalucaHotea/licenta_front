import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingScreenService {
  loaderSubject = new BehaviorSubject<boolean>(false);

  showLoader(): void {
    this.loaderSubject.next(true);
  }

  hideLoader(): void {
    this.loaderSubject.next(false);
  }
}
