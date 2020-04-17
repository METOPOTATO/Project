import { Component, OnInit } from '@angular/core';
import { TutorService } from 'src/app/tutor.service';
import { Message } from 'src/app/classes';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  fullMessage:Message
  message
  messages = []
  room
  constructor(private service:TutorService,private route:ActivatedRoute ) {
    

    // this.service.listMessage.subscribe((data)=>{
    //   this.messages = data
    //   console.log(data)
    // })

    this.getMessages().subscribe((data)=>{
      this.messages = data
    })

    
    this.service.socket.on('message',(data)=>{
      this.messages.push(data)
    })

    this.route.paramMap.subscribe((data)=>{
      this.room = data.get('id')
      console.log(this.room)
      // console.log(this.room)
      // this.service.socket.emit('get',this.room)
    })
  }

  public getMessages() {
    this.route.paramMap.subscribe((data)=>{
      console.log(data)
      this.service.socket.emit('get',data.get('id'))
    })
    this.service.socket.emit('get',this.route.snapshot.paramMap.get('id'))
    return Observable.create((observer) => {
      this.service.socket.on('get', (data) => {
        observer.next(data)
      })
    })
  }

  ngOnInit(): void {}

  public send(){
    
    this.fullMessage = new Message()
    this.fullMessage.room = this.room
    this.fullMessage.content = this.message
    this.fullMessage.by = localStorage.getItem('userEmail')
    this.fullMessage.at = formatDate(Date.now(), 'yyyy-MM-dd', 'en-US')

    
    this.service.send(this.fullMessage)
    this.message = ''
    
    this.service.socket.emit('message',this.fullMessage)
    // this.service.listMessage = this.service.getMessages()
    // this.service.listMessage.subscribe((data) => {
    //   console.log(data)
    //   this.messages = data
    // })
  }
  checkSender(m) {
    if (m.upload_by === localStorage.getItem('userEmail')) {
      return true
    }
  }
  fileToUpload: File = null;
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}
}
