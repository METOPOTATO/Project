import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Message } from './classes';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  public socket;
  private url = 'http://localhost:2222';
  public listMessage:Observable<Message[]>
  private room
  constructor(private route:ActivatedRoute) { 
    console.log('room service here')
    this.socket = io(this.url)

    console.log(this.room)
    // this.socket.emit('get',this.room)
    this.listMessage = this.getMessages()
  }
  

  public send(message) {
    
    this.socket.emit('add_message', message)
    // let room  = this.route.snapshot.paramMap.get('id')
    this.socket.emit('get',message.room)
  }

  public getMessages() {

    return Observable.create((observer) => {
      this.socket.on('get', (data) => {
        observer.next(data)
      })
    })
  }
}
