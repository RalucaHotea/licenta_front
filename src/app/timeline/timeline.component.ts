import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import _ from 'lodash';
import { MonthlyStatistics } from '../models/monthly-statistics.model';
import { StatisticsService } from '../services/statistics-service/statistics.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit {
  selectedYear = new Date().getFullYear();
  years: number[];
  monthlyStatistics: MonthlyStatistics[] = [] as MonthlyStatistics[];
  timelineChart: Chart = {} as Chart;

  constructor(private statisticsService: StatisticsService) {}

  async ngOnInit() {
    var currentYear = new Date().getFullYear();
    this.years = _.range(2021, currentYear + 1);
    await this.loadData();
    this.renderTimelineChart();
  }

  async loadData(): Promise<void> {
    this.monthlyStatistics = await this.statisticsService
      .getMonthlyStatistics(this.selectedYear)
      .toPromise();
  }

  async updateChart(event: Event): Promise<void> {
    this.selectedYear = Number((event.target as HTMLSelectElement).value);
    this.monthlyStatistics = await this.statisticsService
      .getMonthlyStatistics(this.selectedYear)
      .toPromise();
    if (this.timelineChart) {
      this.timelineChart.destroy();
    }
    this.renderTimelineChart();
  }

  renderTimelineChart(): void {
    const completeOrdersCount = this.monthlyStatistics.map(function (e) {
      return e.completeOrdersCount;
    });
    const labels = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    this.timelineChart = new Chart('timeline-chart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Complete Orders',
            backgroundColor: '#0088d4',
            data: completeOrdersCount,
          },
        ],
      },
      options: {
        responsive: true,

        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
