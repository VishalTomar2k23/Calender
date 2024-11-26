import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekViewCalendarComponent } from './week-view-calendar.component';

describe('WeekViewCalendarComponent', () => {
  let component: WeekViewCalendarComponent;
  let fixture: ComponentFixture<WeekViewCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeekViewCalendarComponent]
    });
    fixture = TestBed.createComponent(WeekViewCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
