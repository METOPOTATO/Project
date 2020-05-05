import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { MyService} from './my.service'
import { StaffComponent } from './staff/staff.component';
import { StudentComponent } from './student/student.component';
import { TutorComponent } from './tutor/tutor.component';
import { AppComponent } from './app.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './tutor/room/room.component';
import { TimetableComponent } from './timetable/timetable.component';
import { TutorDashboardComponent } from './tutor-dashboard/tutor-dashboard.component';
import { StaffDashboardComponent } from './staff-dashboard/staff-dashboard.component';
import { StaffMydashboardComponent} from './staff-mydashboard/staff-mydashboard.component'
import { AdminComponent } from './admin/admin.component';
import { StaffReallocateComponent } from './staff-reallocate/staff-reallocate.component';

const routes: Routes = [
  {path:'admin',component:AdminComponent,canActivate:[MyService],data:{role:['admin']}},
  {path:'staff',component:StaffComponent,canActivate:[MyService] ,data:{role:['staff']} },
  {path:'staff/dashboard',component:StaffDashboardComponent,canActivate:[MyService] ,data:{role:['staff']} },
  {path:'staff/mydashboard',component:StaffMydashboardComponent,canActivate:[MyService] ,data:{role:['staff']} },
  {path:'staff/reallocate',component:StaffReallocateComponent,canActivate:[MyService] ,data:{role:['staff']} },
  {path:'student',component:StudentComponent,canActivate:[MyService] ,data:{role:['student']}},

  {path:'tutor',component:TutorComponent,canActivate:[MyService] ,data:{role:['tutor']},
    children:[
      {path:'room/:id',component:RoomComponent},
      {path:'room/:id/calendar',component:TimetableComponent},
      {path:'dashboard',component:TutorDashboardComponent}
    ]
  },
  // {path:'tutor/dashboard',component:TutorDashboardComponent,data:{role:['tutor']}},
  {path:'tutor/room/:id/timetable',component:TimetableComponent,data:{role:['tutor']}},
  {path:'student/timetable',component:TimetableComponent ,data:{role:['student']}},
  {path:'list',component:UsersComponent,canActivate:[MyService]},
  {path:'login',component:LoginFormComponent},
  {path:'forbidden',component:ForbiddenComponent},
  {path:'',component:HomeComponent},
  {path:'404',component:PageNotFoundComponent},
  {path:'**', redirectTo:'/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
