import { Component, OnInit } from '@angular/core';
import {MyService} from '../my.service';
import {User} from '../User';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users :User[];

  constructor(private userService: MyService) { }

  ngOnInit(): void {
    this.getUsers();
  }
  
  getUsers():void{
    this.userService.getList().subscribe(users => this.users = users);
  }
}
