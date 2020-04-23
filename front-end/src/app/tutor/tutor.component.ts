import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-tutor',
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.css']
})
export class TutorComponent implements OnInit {
  roomsUrl = 'http://localhost:2222/listrooms'
  listRooms
  currentTutor = ""
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.currentTutor = localStorage.getItem('userName')
    this.getListRoom()
  }

  getListRoom(){
    console.log('get list room')
    let param = {'tutor_email':localStorage.getItem('userEmail')}
    console.log(param)
    this.http.get<any>(this.roomsUrl,{params:param}).pipe(map(
      (data)=>{
        this.listRooms = data
        console.log(this.listRooms)
      }
    )).subscribe()
  }
}
