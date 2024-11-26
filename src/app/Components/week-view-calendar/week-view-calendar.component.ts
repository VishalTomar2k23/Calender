import { Component, OnInit } from '@angular/core';
import { Event } from 'src/app/Models/eventmodel';
import { EventdetailsService } from 'src/app/Services/eventdetails.service';

@Component({
  selector: 'app-week-view-calendar',
  templateUrl: './week-view-calendar.component.html',
  styleUrls: ['./week-view-calendar.component.scss']
})
export class WeekViewCalendarComponent  implements OnInit {
  multiDayEvents: Event[] = [];
  weekDays: { dayName: string; date: string }[] = [];
  currentWeek: number = 0;
  currentDate: Date = new Date();
  events: Event[] = [];

  constructor(private eventService: EventdetailsService) {}

  ngOnInit(): void {
    this.loadEvents();
    this.calculateWeekNumber();
    this.generateWeekDays();
  }

  // Load events from service and filter multi-day events
  loadEvents(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events;
      this.filterMultiDayEvents(); // Populate multi-day events
    });
  }

  // Calculate the current week number
  calculateWeekNumber(): void {
    const startDate = new Date(this.currentDate.getFullYear(), 0, 1);
    const days = Math.floor(
      (this.currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    this.currentWeek = Math.ceil((days + 1) / 7);
  }

  // Generate the days for the current week
  generateWeekDays(): void {
    const currentDay = this.currentDate.getDay(); // Get current day index (0 = Sunday, 6 = Saturday)
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - currentDay); // Clone before modifying

    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        dayName: this.getDayName(date.getDay()),
        date: date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      });
    }
  }

  // Helper function to get day name (e.g., Monday, Tuesday)
  getDayName(dayIndex: number): string {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysOfWeek[dayIndex];
  }

  // Function to filter events for a given day (by date)
  getEventsForDay(dayDate: string): Event[] {
    const day = new Date(dayDate);
    return this.events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return start <= day && end >= day;
    });
  }

  // Function to calculate event position based on start time
  getEventPosition(startTime: string): string {
    const [hour, minute] = startTime.split(':').map((num) => parseInt(num, 10));
    const top = (hour * 60 + minute) - 8 * 60; // Offset from 8 AM
    return `${Math.max(top / 2, 0)}px`; // Ensure non-negative values
  }

  // Check if the event spans multiple days
  isMultiDayEvent(event: Event): boolean {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    return startDate.getDate() !== endDate.getDate();
  }

  // Change week by either -1 (previous) or +1 (next)
  changeWeek(offset: number): void {
    const newDate = new Date(this.currentDate);
    newDate.setDate(newDate.getDate() + offset * 7); // Adjust by 7 days for next or previous week
    this.currentDate = newDate;
    this.calculateWeekNumber();
    this.generateWeekDays();
  }

  // Filter multi-day events
  filterMultiDayEvents(): void {
    this.multiDayEvents = this.events.filter((event) =>
      this.isMultiDayEvent(event)
    );
  }

  // Calculate the left position of a multi-day event
  getMultiDayLeftPosition(startDate: string): number {
    const startDayIndex = this.getDayIndex(startDate);
    return startDayIndex * this.getColumnWidth();
  }

  // Calculate the width of a multi-day event
  getMultiDayWidth(startDate: string, endDate: string): number {
    const startDayIndex = this.getDayIndex(startDate);
    const endDayIndex = this.getDayIndex(endDate);
    const daySpan = endDayIndex - startDayIndex + 1; // Include the end day
    return daySpan * this.getColumnWidth();
  }

  // Calculate the column width
  getColumnWidth(): number {
    const container = document.querySelector('.calendar-body') as HTMLElement;
    if (container && container.offsetWidth > 0) {
      return container.offsetWidth / 7; // Divide width equally among 7 days
    }
    return 100; // Fallback width for each column
  }

  // Get the index of a day in the current week
  getDayIndex(date: string): number {
    const weekStartDate = new Date(this.weekDays[0].date); // Start of the current week from generated weekDays
    const eventDate = new Date(date);
    return Math.floor(
      (eventDate.getTime() - weekStartDate.getTime()) / (1000 * 60 * 60 * 24)
    ); // Days difference
  }
}
