import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Events } from '../Models/eventsmodel';

@Injectable({
  providedIn: 'root'
})
export class testing{

  constructor() { }

  getEvents(): Observable<Events[]> {
    const sampleEvents: Events[] = [
      {
        id: 1,
        title: 'Meeting with Bob',
        startDate: '2024-11-20T10:00:00.000Z',
        endDate: '2024-11-20T11:00:00.000Z',
        description: 'Discuss project requirements.'
      },
      {
        id: 2,
        title: 'Team Lunch',
        startDate: '2024-11-21T12:00:00.000Z',
        endDate: '2024-11-21T13:00:00.000Z',
        description: 'Lunch with the team at local restaurant.'
      },
      {
        id: 3,
        title: 'Conference',
        startDate: '2024-11-23T09:00:00.000Z',
        endDate: '2024-11-24T18:00:00.000Z',
        description: 'Two-day conference on technology.'
      },
      {
        id: 4,
        title: 'Weekend Trip',
        startDate: '2024-11-25T00:00:00.000Z',
        endDate: '2024-11-26T00:00:00.000Z',
        description: 'Weekend getaway to the mountains.'
      }
    ];

    return of(sampleEvents);
  }
}
