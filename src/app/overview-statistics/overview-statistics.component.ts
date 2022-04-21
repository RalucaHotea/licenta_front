import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { OrderStatisticsDto } from '../models/order-statistics.model';
import { StatisticsService } from '../services/statistics-service/statistics.service';

@Component({
  selector: 'app-overview-statistics',
  templateUrl: './overview-statistics.component.html',
  styleUrls: ['./overview-statistics.component.css'],
})
export class OverviewStatisticsComponent implements OnInit {
  orderStatistics: OrderStatisticsDto = {} as OrderStatisticsDto;
  inSubmissionPercentage: number;
  shippedPercentage: number;
  completePercentage: number;

  constructor(private statisticsService: StatisticsService) {}

  async ngOnInit() {
    await this.loadStatistics();
    this.inSubmissionPercentage = this.renderPieChart(
      this.orderStatistics.inSubmissionOrdersNumber,
      'in-submission',
      'In Submission'
    );
    this.shippedPercentage = this.renderPieChart(
      this.orderStatistics.shippedOrdersNumber,
      'shipped',
      'Shipped'
    );
    this.completePercentage = this.renderPieChart(
      this.orderStatistics.completeOrdersNumber,
      'complete',
      'Complete'
    );

    this.renderOverviewChart();
  }

  async loadStatistics(): Promise<void> {
    this.orderStatistics = await this.statisticsService
      .getOrderStatistics()
      .toPromise();
  }

  renderPieChart(
    ideasNumber: number,
    canvasName: string,
    ideasType: string
  ): number {
    const totalIdeasNumber = this.orderStatistics.totalOrdersNumber;
    const otherIdeasNumber = totalIdeasNumber - ideasNumber;
    let ideasPercentage = (ideasNumber * 100) / totalIdeasNumber;

    new Chart(canvasName, {
      type: 'doughnut',
      data: {
        labels: [ideasType, 'Others'],
        datasets: [
          {
            label: '# of Votes',
            data: [ideasNumber, otherIdeasNumber],
            backgroundColor: ['#ffffff', '#b3bab5'],
            borderColor: ['#ffffff', '#419e98'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
      },
    });
    return ideasPercentage;
  }

  renderOverviewChart() {
    const inSubmissionOrdersNumber =
      this.orderStatistics.inSubmissionOrdersNumber;
    const shippedOrdersNumber = this.orderStatistics.shippedOrdersNumber;
    const completeOrdersNumber = this.orderStatistics.completeOrdersNumber;

    new Chart('ideas-overview', {
      type: 'pie',
      data: {
        labels: ['In Submission', 'Shipped', 'Complete'],
        datasets: [
          {
            label: '# of Votes',
            data: [
              inSubmissionOrdersNumber,
              shippedOrdersNumber,
              completeOrdersNumber,
            ],
            backgroundColor: ['#0088d4', '#219557', '#b12ea9'],
            borderColor: ['#ffffff'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        legend: {
          position: 'right',
          labels: {
            fontSize: 18,
          },
        },
      },
    });
  }
}
