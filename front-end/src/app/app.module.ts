import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {HttpClientModule} from '@angular/common/http';
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
    RoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
 