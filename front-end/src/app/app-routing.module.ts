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

const routes: Routes = [
  {path:'staff',component:StaffComponent,canActivate:[MyService] ,data:{role:['staff']} },
  {path:'student',component:StudentComponent,canActivate:[MyService] ,data:{role:['student']}},

  // {path:'tutor/room/:id',component:Component,canActivate:[MyService] ,data:{role:['tutor']}},
  {path:'tutor',component:TutorComponent,canActivate:[MyService] ,data:{role:['tutor']},
    children:[
      {path:'room/:id',component:RoomComponent}
    ]
  },

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
