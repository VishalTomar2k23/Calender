import { Component, OnInit } from '@angular/core';
import {testing } from 'src/app/Services/testing.service';
import { Events } from 'src/app/Models/eventsmodel';

@Component({
  selector: 'app-week-view',
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss'],
})
export class WeekViewComponent implements OnInit {
  currentWeek: Date[] = [];
  events: Events[] = [];
  multiDayEvents: Events[] = [];
  singleDayEvents: { [key: string]: Events[] } = {};

  constructor(private eventService: testing) {}

  ngOnInit() {
    this.setCurrentWeek(new Date());
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events;
      this.processEvents();
    });
  }

  setCurrentWeek(date: Date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Adjust to start of week (Sunday)
    this.currentWeek = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i); // Increment by 1 day
      return day;
    });
  }

  previousWeek() {
    const firstDay = this.currentWeek[0];
    const previousWeekDate = new Date(firstDay);
    previousWeekDate.setDate(firstDay.getDate() - 7);
    this.setCurrentWeek(previousWeekDate);
  }

  nextWeek() {
    const firstDay = this.currentWeek[0];
    const nextWeekDate = new Date(firstDay);
    nextWeekDate.setDate(firstDay.getDate() + 7);
    this.setCurrentWeek(nextWeekDate);
  }

  processEvents() {
    // Filter multi-day events (events spanning across multiple days)
    this.multiDayEvents = this.events.filter(
      (event) => new Date(event.startDate) < new Date(event.endDate)
    );

    // Organize single-day events by date
    this.singleDayEvents = {};
    this.currentWeek.forEach((day) => {
      const dateKey = day.toISOString().split('T')[0];
      this.singleDayEvents[dateKey] = this.events.filter(
        (event) =>
          new Date(event.startDate).toDateString() === day.toDateString() &&
          new Date(event.endDate).toDateString() === day.toDateString()
      );
    });
  }

  calculateGridColumn(event: Events): string {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    const startIndex = this.currentWeek.findIndex(
      (date) =>
        date.toISOString().split('T')[0] === startDate.toISOString().split('T')[0]
    );
    const endIndex = this.currentWeek.findIndex(
      (date) =>
        date.toISOString().split('T')[0] === endDate.toISOString().split('T')[0]
    );

    if (startIndex === -1 || endIndex === -1) {
      return '';
    }

    return `${startIndex + 1} / span ${endIndex - startIndex + 1}`;
  }

  isEventVisibleInColumn(event: Events, date: Date): boolean {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    return date >= startDate && date <= endDate; // Event spans this date
  }
}
