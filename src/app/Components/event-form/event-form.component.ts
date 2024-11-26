import { Component,  OnInit, } from '@angular/core';
import { EventdetailsService } from 'src/app/Services/eventdetails.service';
import { Event } from 'src/app/Models/eventmodel';


@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {


  ngOnInit(): void {
    this.fetchEvents();
  }
  constructor(private eventService:EventdetailsService){}

  events: { [date: string]: Event[] } = {};
  currentDate: Date = new Date();
  toDate(dateString: string): Date {
    return new Date(dateString);
  }
 

  fetchEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events.reduce((acc: { [key: string]: Event[] }, event: Event) => {

        const dateKey = new Date(event.startDate).toISOString().split('T')[0];

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }

        acc[dateKey].push(event);
        return acc;
      }, {});
    });
  }
  getSortedDates(): string[] {
    return Object.keys(this.events)
      .sort((a, b) => {
        const dateA = new Date(this.events[a][0].startDate).getTime();
        const dateB = new Date(this.events[b][0].startDate).getTime();
        return dateA - dateB;
      });
  }
  }


