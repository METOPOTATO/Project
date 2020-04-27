import { Component, OnInit } from '@angular/core';
import { MyService } from '../my.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User, Token } from '../User';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  user: User = {
    email: "",
    password: ""
  }
  private roomUrl = "http://127.0.0.1:2222/room"

  constructor(public service: MyService, private router: Router) { }

  ngOnInit(): void {

  }

  login() {
    this.service.login(this.user)
  }
}
