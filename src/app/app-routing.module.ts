import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalenderViewComponent } from './Components/calender-view/calender-view.component';
import { EventFormComponent } from './Components/event-form/event-form.component';
import { WeekComponent } from './Components/week/week.component';
import { WeekViewCalendarComponent } from './Components/week-view-calendar/week-view-calendar.component';
import { WeekViewComponent } from './Components/week-view/week-view.component';



const routes: Routes = [
  {path:'calender',component:CalenderViewComponent},
  {path:'eventform',component:EventFormComponent},
  {path:'test',component:WeekComponent},
  {path:'test2',component:WeekViewCalendarComponent},
  {path:'test3',component:WeekViewComponent},
  { path: '', redirectTo: '/calender', pathMatch: 'full' },  // Default route
  { path: '**', redirectTo: '/calender' },  // Catch-all route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule,]
})
export class AppRoutingModule { }
