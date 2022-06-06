import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import _ from 'lodash';
import { OrderStatisticsDto } from '../models/order-statistics.model';
import { StatisticsService } from '../services/statistics-service/statistics.service';

@Component({
  selector: 'app-overview-statistics',
  templateUrl: './overview-statistics.component.html',
  styleUrls: ['./overview-statistics.component.css'],
})
export class OverviewStatisticsComponent implements OnInit {
  selectedYear = new Date().getFullYear();
  orderStatistics: OrderStatisticsDto = {} as OrderStatisticsDto;
  overviewChart: Chart = {} as Chart;
  years: number[];
  inSubmissionPercentage: number;
  shippedPercentage: number;
  completePercentage: number;

  constructor(private statisticsService: StatisticsService) {}

  async ngOnInit() {
    var currentYear = new Date().getFullYear();
    this.years = _.range(2021, currentYear + 1);
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
      .getOrderPerYearStatistics(this.selectedYear)
      .toPromise();
  }

  async updateChart(event: Event): Promise<void> {
    this.selectedYear = Number((event.target as HTMLSelectElement).value);
    this.orderStatistics = await this.statisticsService
      .getOrderPerYearStatistics(this.selectedYear)
      .toPromise();
    if (this.overviewChart) {
      this.overviewChart.destroy();
    }
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

  renderPieChart(
    ordersNumber: number,
    canvasName: string,
    orderType: string
  ): number {
    const totalOrdersNumber = this.orderStatistics.totalOrdersNumber;
    const otherOrdersNumber = totalOrdersNumber - ordersNumber;
    let ordersPercentage = (ordersNumber * 100) / totalOrdersNumber;
    console.log(otherOrdersNumber);

    new Chart(canvasName, {
      type: 'doughnut',
      data: {
        labels: [orderType, 'Others'],
        datasets: [
          {
            label: '# of Votes',
            data: [ordersNumber, otherOrdersNumber],
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

    this.overviewChart = new Chart('order-overview', {
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
