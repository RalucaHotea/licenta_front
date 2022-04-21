import { OrderStatisticsDto } from './../../models/order-statistics.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private baseUrl = environment.apiUrl + 'Statistics';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  constructor(private http: HttpClient) {}

  getOrderStatistics(): Observable<OrderStatisticsDto> {
    return this.http.get<OrderStatisticsDto>(
      this.baseUrl + '/GetOverviewOrdersStatistics'
    );
  }
}
