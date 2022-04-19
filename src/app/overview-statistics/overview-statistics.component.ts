import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { IdeaStatisticsDto } from '../models/ideaStatisticsDto';
import { StatisticsService } from '../services/statistics.service';

@Component({
    selector: 'app-overview-statistics',
    templateUrl: './overview-statistics.component.html',
    styleUrls: ['./overview-statistics.component.css'],
})
export class OverviewStatisticsComponent implements OnInit {
    ideaStatistics: IdeaStatisticsDto;
    inApprovalPercentage: unknown;
    approvedPercentage: unknown;
    rejectedPercentage: unknown;
    inImplementationPercentage: unknown;
    implementedPercentage: unknown;

    constructor(private statisticsService: StatisticsService) {}

    async ngOnInit() {
        await this.loadStatistics();
        this.inApprovalPercentage = this.renderPieChart(
            this.ideaStatistics.inApprovalIdeasNumber,
            'in-approval',
            'In Approval'
        );
        this.approvedPercentage = this.renderPieChart(
            this.ideaStatistics.approvedIdeasNumber,
            'approved',
            'Approved'
        );
        this.inImplementationPercentage = this.renderPieChart(
            this.ideaStatistics.inImplementationIdeasNumber,
            'in-implementation',
            'In Implementation'
        );
        this.rejectedPercentage = this.renderPieChart(
            this.ideaStatistics.rejectedIdeasNumber,
            'rejected',
            'Rejected'
        );
        this.implementedPercentage = this.renderPieChart(
            this.ideaStatistics.implementedIdeasNumber,
            'implemented',
            'Implemented'
        );
        this.renderOverviewChart();
    }

    async loadStatistics() {
        this.ideaStatistics = await this.statisticsService
            .getIdeaStatistics()
            .toPromise();
    }

    renderPieChart(
        ideasNumber: number,
        canvasName: string,
        ideasType: string
    ): number {
        const totalIdeasNumber = this.ideaStatistics.allIdeasNumber;
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
        const inApprovalIdeasNumber = this.ideaStatistics.inApprovalIdeasNumber;
        const approvedIdeasNumber = this.ideaStatistics.approvedIdeasNumber;
        const rejectedIdeasNumber = this.ideaStatistics.rejectedIdeasNumber;
        const inImplementationIdeasNumber =
            this.ideaStatistics.inImplementationIdeasNumber;
        const implementedIdeasNumber =
            this.ideaStatistics.implementedIdeasNumber;

        new Chart('ideas-overview', {
            type: 'pie',
            data: {
                labels: [
                    'In approval',
                    'Approved',
                    'In Implementation',
                    'Implemented',
                    'Rejected',
                ],
                datasets: [
                    {
                        label: '# of Votes',
                        data: [
                            inApprovalIdeasNumber,
                            approvedIdeasNumber,
                            inImplementationIdeasNumber,
                            implementedIdeasNumber,
                            rejectedIdeasNumber,
                        ],
                        backgroundColor: [
                            '#0088d4',
                            '#219557',
                            '#b12ea9',
                            '#419e98',
                            '#656a6f',
                        ],
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
