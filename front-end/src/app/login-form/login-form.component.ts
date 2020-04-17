import { Component, OnInit } from '@angular/core';
import { User } from '../User';
import { MyService } from '../my.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  user:User = {
    email : "",
    password : ""
  }
  constructor(public service:MyService,private router:Router) { }

  ngOnInit(): void {
  }

  login(){
    
     
    const token = this.service.login(this.user).subscribe(
      ()=> {
        // const email = localStorage.getItem('userEmail')
        var role = localStorage.getItem('userRole')
        console.log(role)
        if(role !='' && role != null){
          const link = "/"+ role
          this.router.navigateByUrl(link)
        }
        else{

        }
      }
    )
    console.log(this.user.email)
    console.log(this.user.password)
    console.log(token)
  }

}
