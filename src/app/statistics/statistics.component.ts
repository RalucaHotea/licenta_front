import { Component, ElementRef, OnInit } from '@angular/core';
import { OverviewStatisticsComponent } from '../overview-statistics/overview-statistics.component';
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  selectedPage = 'Overview';

  constructor() {}

  ngOnInit() {}

  changePage(page) {
    this.selectedPage = page;
  }
}
