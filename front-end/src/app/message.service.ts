import { Injectable, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Message } from './classes';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MessageService  {

  private url = 'http://localhost:2222';
  private roomUrl = 'http://localhost:2222/room'
  public socket;

  public listMesaages: Observable<Message[]>

  list2 = []
  constructor(private http: HttpClient) {
    this.socket = io(this.url)
    
      this.socket.emit('get',localStorage.getItem('room'))
      //get list messages
      this.listMesaages = this.getMessages() 
      //get room
      let param = { 'student': localStorage.getItem('userEmail') }
      // this.http.get<any>(this.roomUrl, { params: param }).pipe(
      //   map((data) => {
      //     if(data){
      //       localStorage.setItem('room', data.room_id)
      //     }
      //   })
      // ).subscribe()
    

  }

  public send(message) {
    
    this.socket.emit('add_message', message)
    this.socket.emit('get',localStorage.getItem('room'))
  }

  public getMessages() {
    return Observable.create((observer) => {
      this.socket.on('get', (data) => {
        observer.next(data)
      })
    })
  }
}
