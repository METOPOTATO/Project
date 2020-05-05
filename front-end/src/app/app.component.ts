import { Component } from '@angular/core';
import { MyService } from './my.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-end';
  constructor(public auth:MyService){

  }

  checkRole(){
    if(!localStorage.getItem('room')){
      alert('You dont have any contact')
    }
  }

}
