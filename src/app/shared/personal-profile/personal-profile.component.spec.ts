/* eslint-disable unused-imports/no-unused-imports-ts */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* tslint:disable:no-unused-variable */
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PersonalProfileComponent } from './personal-profile.component';

describe('PersonalProfileComponent', () => {
  let component: PersonalProfileComponent;
  let fixture: ComponentFixture<PersonalProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalProfileComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
