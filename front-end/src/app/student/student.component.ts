import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../message.service';
import { Message } from '../classes'
import { Observable, pipe } from 'rxjs';
import { formatDate } from '@angular/common';
import { map } from 'rxjs/operators';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit, OnDestroy {
  fullMessage: Message
  message: string
  listMessage: Message[]

  private roomUrl = 'http://localhost:2222/room'

  constructor(private messageService: MessageService,private http: HttpClient) {
    // this.messageService.listMesaages.subscribe((data) => {
    //   this.listMessage = data
    // })

  }

  getMessage(){
    let param = { 'student': localStorage.getItem('userEmail') }
    this.http.get<any>(this.roomUrl, { params: param }).pipe(
      map((data) => {
        localStorage.setItem('room', data.room_id)
        
        this.messageService.socket.emit('get',localStorage.getItem('room'))
      })
    ).subscribe()
    
    this.messageService.socket.emit('get',localStorage.getItem('room'))
    return Observable.create((observer)=>{
      this.messageService.socket.on('get',(data)=>{
        observer.next(data)
      })
    })
  }

  ngOnInit(): void {
    this.getMessage().subscribe((data)=>{
      this.listMessage = data;
    })
    this.messageService.socket.on('message',(data)=>{
      this.listMessage.push(data)
      
    })
   }

  ngOnDestroy(): void { }
  
  // send() {
  //   //send data Message
  //   this.fullMessage = new Message()
  //   this.fullMessage.content = this.message
  //   this.fullMessage.room = parseInt(localStorage.getItem('room'))
  //   this.fullMessage.by = localStorage.getItem('userEmail')
  //   this.fullMessage.at = formatDate(Date.now(), 'yyyy-MM-dd', 'en-US')

  //   this.messageService.send(this.fullMessage)
  //   this.message = ''

  //   this.messageService.listMesaages = this.messageService.getMessages()
  //   this.messageService.listMesaages.subscribe((data) => {
  //     console.log(data)
  //     this.listMessage = data
  //   })
  // }

  send() {
    //send data Message
    this.fullMessage = new Message()
    this.fullMessage.content = this.message
    this.fullMessage.room = parseInt(localStorage.getItem('room'))
    this.fullMessage.by = localStorage.getItem('userEmail')
    this.fullMessage.at = formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss', 'en-US')

    this.messageService.send(this.fullMessage)
    this.message = ''
    this.messageService.socket.emit('message',this.fullMessage)

  }

  
  checkSender(m) {
    if (m.upload_by === localStorage.getItem('userEmail')) {
      return true
    }
  }
}
