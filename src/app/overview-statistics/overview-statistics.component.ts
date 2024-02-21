import { Component, OnInit } from '@angular/core';
import _ from 'lodash';
import { OrderStatisticsDto } from '../models/order-statistics.model';
import { StatisticsService } from '../services/statistics-service/statistics.service';
import { Chart, ChartType, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-overview-statistics',
  templateUrl: './overview-statistics.component.html',
  styleUrls: ['./overview-statistics.component.css'],
})
export class OverviewStatisticsComponent implements OnInit {
  selectedYear = new Date().getFullYear();
  orderStatistics: OrderStatisticsDto = {} as OrderStatisticsDto;
  overviewChart: Chart = {} as Chart;
  inSubmissionChart: Chart = {} as Chart;
  shippedChart: Chart = {} as Chart;
  completeChart: Chart = {} as Chart;
  years: number[];
  inSubmissionPercentage: number;
  shippedPercentage: number;
  completePercentage: number;

  constructor(private statisticsService: StatisticsService) {}

  async ngOnInit() {
    var currentYear = new Date().getFullYear();
    this.selectedYear = currentYear;
    this.years = _.range(currentYear - 1, currentYear + 1);
    this.orderStatistics = await this.statisticsService
    .getOrderPerYearStatistics(this.selectedYear)
    .toPromise();
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

  async loadStatistics() {
    await this.statisticsService
      .getOrderPerYearStatistics(this.selectedYear)
      .subscribe((x) => {
        this.orderStatistics = x;
      });
  }

  async updateChart(event: Event): Promise<void> {
    this.selectedYear = Number((event.target as HTMLSelectElement).value);
    this.orderStatistics = await this.statisticsService
      .getOrderPerYearStatistics(this.selectedYear)
      .toPromise();
    if (this.overviewChart) {
      this.overviewChart.destroy();
    }
    if (this.inSubmissionChart) {
      this.inSubmissionChart.destroy();
    }
    if (this.shippedChart) {
      this.shippedChart.destroy();
    }
    if (this.completeChart) {
      this.completeChart.destroy();
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
    if (canvasName === 'in-submission') {
      this.inSubmissionChart = new Chart(canvasName, {
        type: 'doughnut' as ChartType,
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
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    } else if (canvasName === 'shipped') {
      this.shippedChart = new Chart(canvasName, {
        type: 'doughnut' as ChartType,
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
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    } else if (canvasName === 'complete') {
      this.completeChart = new Chart(canvasName, {
        type: 'doughnut' as ChartType,
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
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
    return ordersPercentage;
  }

  renderOverviewChart() {
    const inSubmissionOrdersNumber =
      this.orderStatistics.inSubmissionOrdersNumber;
    const shippedOrdersNumber = this.orderStatistics.shippedOrdersNumber;
    const completeOrdersNumber = this.orderStatistics.completeOrdersNumber;
    this.overviewChart = new Chart('order-overview', {
      type: 'pie' as ChartType,
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
        plugins: {
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 18,
              },
            },
          },
        },
      },
    });
  }
}
