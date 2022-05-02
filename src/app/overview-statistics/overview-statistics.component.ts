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
    ordersNumber: number,
    canvasName: string,
    orderType: string
  ): number {
    const totalOrdersNumber = this.orderStatistics.totalOrdersNumber;
    const otherOrdersNumber = totalOrdersNumber - ordersNumber;
    let ordersPercentage = (ordersNumber * 100) / totalOrdersNumber;

    new Chart(canvasName, {
      type: 'doughnut',
      data: {
        labels: [orderType, 'Others'],
        datasets: [
          {
            label: '# of Votes',
            data: [orderType, otherOrdersNumber],
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
    return ordersPercentage;
  }

  renderOverviewChart() {
    const inSubmissionOrdersNumber =
      this.orderStatistics.inSubmissionOrdersNumber;
    const shippedOrdersNumber = this.orderStatistics.shippedOrdersNumber;
    const completeOrdersNumber = this.orderStatistics.completeOrdersNumber;

    new Chart('order-overview', {
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
