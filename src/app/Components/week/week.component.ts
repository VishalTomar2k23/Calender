import { Component, OnInit, ViewChild } from '@angular/core';
import { EventdetailsService } from 'src/app/Services/eventdetails.service';
import { Event } from 'src/app/Models/eventmodel';
import { ToasterComponent } from '../toaster/toaster.component';
interface EventSegment {
  start: Date;       // Start date of the segment
  end: Date;         // End date of the segment
  width: string;     // Width for this segment
  class: string;     // CSS class for this segment
}


@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnInit {

  @ViewChild(ToasterComponent) toaster!: ToasterComponent;
 constructor(private eventService:EventdetailsService){}

//Variables Declaration
  currentDate: Date = new Date();
  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  daysInMonth: number[] = [];
  showEventForm: boolean = false;
  events: Event[] = [];
  month!: number;
  year!: number;
  days: any[] = [];
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();
  yearOptions: Number[]=[];
  selectedDayEvents: Event[] = [];
  showEventDetailsModal: boolean = false;
  countupdate:number=0;
  eventid:number =0;
  showAllEVents: boolean = false;
  formtitle:string='';
  hideWeekends: boolean = false;
  weeks: Array<{ day: number, events: any[], isWeekend: boolean }> = [];
  eventSegments: EventSegment[] = [];



  // Event Form Model
  newEventTitle: string = '';
  newEventOrganizer: string = '';
  newEventStartDate: string = '';
  newEventEndDate: string = '';
  newEventDescription: string = '';
  newEventLink: string = '';
  newEventStartTime: string = '';
  newEventEndTime: string = '';

  ngOnInit()
  {
    this.month = this.currentDate.getMonth();
    this.year = this.currentDate.getFullYear();
    this.generateCalendar(this.month,this.year);
    this.populateYears();
    this.loadEvents();

  }
  getRandomMargin(w: number): number {
    const max = (w + 1) * 50;
    return this.randomize(0, max); // Random number between 0 and (w + 1) * 10
  }

  randomize(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      this.assignEventsToCalendar();

    });
  }

  toggleShowEvents(): void {
    this.showAllEVents = !this.showAllEVents;
  }

  toggleShowWeekends() {
    this.hideWeekends = !this.hideWeekends;
    this.loadEvents();
    this.generateCalendar(this.month, this.year);
  }

  EditEventForm(event:Event)
  {

    this.formtitle = "Edit Event";
    this.countupdate =1;
     this.eventid = event.id ;
    this.newEventTitle = event.title
    this.newEventOrganizer= event.organizer
    this.newEventStartDate=event.startDate
    this.newEventEndDate= event.endDate
    this.newEventDescription= event.description
    this.newEventLink= event.link
    this.newEventStartTime= event.startTime
    this.newEventEndTime= event.endTime
    this.showEventDetailsModal = true ;

  }
populateYears(): void
{
    for (let i = 1990; i <= 2100; i++) {
      this.yearOptions.push(i);
    }


}
assignEventsToCalendar() {
  if (!Array.isArray(this.days) || this.days.length === 0) {
    console.warn('No days available in the calendar.');
    return;
  }

  for (const event of this.events) {
    // Validate event and its startDate
    if (!event || !event.startDate) {
      console.warn('Invalid event detected:', event);
      continue;
    }

    const eventDate = new Date(event.startDate);
    eventDate.setHours(0, 0, 0, 0); // Normalize eventDate for comparison

    for (const week of this.days) {
      if (!Array.isArray(week)) continue; // Skip invalid weeks

      for (const day of week) {
        // Ensure day object is valid
        if (!day || !day.day) continue;

        const dayDate = new Date(this.year, this.month, day.day);
        dayDate.setHours(0, 0, 0, 0); // Normalize dayDate for comparison

        // Check if the event's startDate matches the calendar day (past and future included)
        if (dayDate.getTime() === eventDate.getTime()) {
          if (!Array.isArray(day.events)) day.events = []; // Initialize events if missing
          day.events.push(event);

          // Sort events by their start time (optional, based on startTime)
          day.events.sort((a: Event, b: Event) => {
            const aStartTime = new Date(`${a.startDate}T${a.startTime}`).getTime();
            const bStartTime = new Date(`${b.startDate}T${b.startTime}`).getTime();
            return aStartTime - bStartTime; // Sort in ascending order
          });
          day.showAllEvents = false;
        }
      }
    }
  }
}

getEventClassByCount(day: any): string {
  if (!day || !Array.isArray(day.events)) return '';

  const eventCount = day.events.length;

  if (eventCount > 7) {
    return 'high-events'; // Many events
  } else if (eventCount > 3) {
    return 'medium-events'; // Moderate events
  } else if (eventCount > 0) {
    return 'low-events'; // Few events
  }
  return ''; // No events
}


 changeYear()
 {
    this.year=this.selectedYear;
    console.log(this.year);
    console.log(this.selectedYear);
    this.loadEvents();
    this.generateCalendar(this.year,this.month);
    this.changeMonth(+1);
    this.changeMonth(-1);
    this.loadEvents();
 }
 generateCalendar(month: number, year: number): void {
  this.days = [];
  const firstDay = new Date(year, month, 1).getDay();  // Day of the week the month starts on
  const daysInMonth = new Date(year, month + 1, 0).getDate();  // Number of days in the month

  // Initialize 2D array with 7 columns (days of the week)
  const weeks = Array.from({ length: 6 }, () => Array(0).fill(null)); // 6 weeks in a month, 7 days in a week

  // Fill the 2D array with day numbers and blank/null for empty spaces
  let currentDay = 1;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 7; col++) {
      if (row === 0 && col < firstDay) {
        continue;  // Skip filling days before the first day of the month
      }

      if (currentDay > daysInMonth) {
        break;  // Stop filling once all days of the month are placed
      }

      // Skip weekends if hideWeekends is true
      if (this.hideWeekends && (col === 0 || col === 6)) {
        weeks[row][col] = null; // Represent weekends as blank
      } else {
        weeks[row][col] = { day: currentDay, events: [] };
      }

      currentDay++;
    }
  }

  this.days = weeks;
}

openEventForm(Day: number) {
    if(this.countupdate==0)
      {
        this.formtitle="Add Event";
      }
    const selectedDate = new Date(this.year, this.month, Day);
    console.log(selectedDate);
    console.log(this.currentDate);
    if (selectedDate >= this.currentDate) {
      this.newEventStartDate = `${this.year}-${this.month + 1}-${Day}`;
      console.log(this.newEventStartDate);
      this.showEventForm = true;
    } else {
      this.toaster.showMessage('error', 'Cannot set events on past dates.' ,500);

    }



  }

closeEventForm() {
    this.showEventForm = false;
    this.resetFormFields();
  }

resetFormFields() {
    this.newEventTitle = '';
    this.newEventOrganizer = '';
    this.newEventStartDate = '';
    this.newEventEndDate = '';
    this.newEventDescription = '';
    this.newEventLink = '';
    this.newEventStartTime = '';
    this.newEventEndTime = '';
    this.formtitle="Add Event";
    this.countupdate=0;
  }

saveEvent()
   {
    if(this.countupdate==0){
      console.log("New is clicked");
      if((this.newEventStartDate<=this.newEventEndDate)&&(this.newEventStartTime<this.newEventEndTime))
        {
        const event: Omit<Event, 'id'> = {
          title: this.newEventTitle,
          organizer: this.newEventOrganizer,
          startDate: this.newEventStartDate,
          endDate: this.newEventEndDate,
          description: this.newEventDescription,
          link: this.newEventLink,
          startTime: this.newEventStartTime,
          endTime: this.newEventEndTime
        };

   // Call the service to save the event
   this.eventService.saveEvent(event).subscribe(response =>
    {
   this.toaster.showMessage('success', 'Event saved successfully', 500);
  this.closeEventForm();
  },
  (error) =>
  {
  console.error('Error saving event:', error);
  }
  );
  this.closeEventForm();
  }
  else{
  this.toaster.showMessage('error', 'End date should be greater than start date', 5000);
  }
    }
    else{
      console.log("old is clicked")
      if((this.newEventStartDate<=this.newEventEndDate)&&(this.newEventStartTime<this.newEventEndTime))
        {
        const event: Event = {
          id:this.eventid ,
          title: this.newEventTitle,
          organizer: this.newEventOrganizer,
          startDate: this.newEventStartDate,
          endDate: this.newEventEndDate,
          description: this.newEventDescription,
          link: this.newEventLink,
          startTime: this.newEventStartTime,
          endTime: this.newEventEndTime
        };

   // Call the service to save the event
   this.eventService.updateEvent(event).subscribe(response =>
    {
   this.toaster.showMessage('success', 'Event updated successfully', 500);
  this.closeEventForm();
  },
  (error) =>
  {
  }
  );
  this.closeEventForm();
  }
  else{
  this.toaster.showMessage('error','End date and time is Smaller than Start Date and time')
  }
    }

  }

changeMonth(offset: number): void {
    this.month += offset;
    if (this.month > 11) {
      this.month = 0;
      ++this.year;
    } else if (this.month < 0) {
      this.month = 11;
      this.year--;
    }

    this.generateCalendar(this.month, this.year);
    this.loadEvents();

  }
 getEventClass(event: any): { class: string, width: string } {

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const currentDate = new Date();

  // Check if dates are valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error('Invalid start or end date:', event);
    return { class: 'event-blue', width: '100px' };
  }

  // Check if the event is in the past
  const isPastEvent = endDate < currentDate;

  // Calculate the difference in time
  const timeDiff = endDate.getTime() - startDate.getTime();
  const dayDiff = timeDiff / (1000 * 3600 * 24);

  // Find the end of the week for startDate (assuming Sunday as the last day of the week)
  const startDayOfWeek = startDate.getDay();
  const daysToEndOfWeek = 6 - startDayOfWeek; // Days remaining to the end of the week (Sunday)
  const breakDate = new Date(startDate);
  breakDate.setDate(startDate.getDate() + daysToEndOfWeek);  // This will be the end of the current week

  let width = '150px'; // Default width for single-day events
  let eventClass = 'event-blue';  // Default class for past events

  // If the event spans multiple days
  if (dayDiff > 0) {
    // If the event spans across two weeks, we need to split it
    if (endDate > breakDate) {
      console.log(breakDate , endDate);
      // First segment: from startDate to breakDate (end of current week)
      const firstSegmentDiff = (breakDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
      const firstSegmentWidth = (firstSegmentDiff + 1) * 200 + (firstSegmentDiff - 1) * 10;

      // Second segment: from the start of the next week to endDate
      const nextWeekStart = new Date(breakDate);
      nextWeekStart.setDate(breakDate.getDate() + 1);  // Start of the next week
      const secondSegmentDiff = (endDate.getTime() - nextWeekStart.getTime()) / (1000 * 3600 * 24);
      const secondSegmentWidth = (secondSegmentDiff + 1) * 200 + (secondSegmentDiff - 1) * 10;

      // Combine widths for both segments
      width = `${firstSegmentWidth + secondSegmentWidth}px`;
      eventClass = isPastEvent ? 'event-grey' : 'event-green';
    } else {
      // Event is within the same week
      width = `${(dayDiff + 1) * 200 + (dayDiff - 1) * 10}px`;
      eventClass = isPastEvent ? 'event-grey' : 'event-green';
    }
  }

  return {
    class: eventClass,
    width: width
  };
}


}

