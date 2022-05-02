/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OverviewStatisticsComponent } from './overview-statistics.component';

describe('OverviewStatisticsComponent', () => {
    let component: OverviewStatisticsComponent;
    let fixture: ComponentFixture<OverviewStatisticsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OverviewStatisticsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OverviewStatisticsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
