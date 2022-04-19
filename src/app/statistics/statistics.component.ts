import { IdeaStatisticsPerLevelDto } from './../models/ideaStatisticsPerLevelDto';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { IdeaStatisticsDto } from '../models/ideaStatisticsDto';
import { StatisticsService } from '../services/statistics.service';

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
