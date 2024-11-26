import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalenderViewComponent } from './Components/calender-view/calender-view.component';
import { EventFormComponent } from './Components/event-form/event-form.component';
import { FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToasterComponent } from './Components/toaster/toaster.component';
import { WeekComponent } from './Components/week/week.component';
import { WeekViewCalendarComponent } from './Components/week-view-calendar/week-view-calendar.component';
import { WeekViewComponent } from './Components/week-view/week-view.component';


@NgModule({
  declarations: [
    AppComponent,
    EventFormComponent,
    CalenderViewComponent,
    ToasterComponent,
    WeekComponent,
    WeekViewCalendarComponent,
    WeekViewComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
