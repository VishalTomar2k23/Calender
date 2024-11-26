import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Event {
  id: number;
  title: string;
  organizer: string;
  startDate: string;
  endDate: string;
  description: string;
  link: string;
  startTime: string; // Format: "HH:mm" or "HH:mm:ss"
  endTime: string;   
}
@Injectable({
  providedIn: 'root',
})

export class EventdetailsService {
  private apiUrl = 'http://localhost:3000/events';
  private currentId = 1;

  constructor(private http:HttpClient) {}

 // Get all events
 getEvents(): Observable<Event[]> {
  return this.http.get<Event[]>(this.apiUrl);
}

// Save event
saveEvent(event: Omit<Event, 'id'>): Observable<any> {
  return this.http.post(this.apiUrl, event);
}
updateEvent(event: Event): Observable<any> {
  const url = `${this.apiUrl}/${event.id}`;
  return this.http.put(url, event);
}
}

