import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {  HttpClientModule} from '@angular/common/http';
import { UsersComponent } from './users/users.component';
import { LoginFormComponent } from './login-form/login-form.component';

import { FormsModule } from '@angular/forms';
import { StudentComponent } from './student/student.component';
import { TutorComponent } from './tutor/tutor.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { StaffComponent } from './staff/staff.component';

import { RoomComponent } from './tutor/room/room.component';

import { FlatpickrModule } from 'angularx-flatpickr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { TimetableComponent } from './timetable/timetable.component';
@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    LoginFormComponent,
    StudentComponent,
    TutorComponent,
    ForbiddenComponent,
    PageNotFoundComponent,
    HomeComponent,
    StaffComponent,
    RoomComponent,
    TimetableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [RoomComponent,TimetableComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
 