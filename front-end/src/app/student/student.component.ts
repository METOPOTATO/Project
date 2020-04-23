import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from '../message.service';
import { Message } from '../classes'
import { Observable, pipe } from 'rxjs';
import { formatDate } from '@angular/common';
import { map } from 'rxjs/operators';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';

import { FileService } from 'src/app/file.service'
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
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


  selectedFile

  process: number = 0
  listFile: Document[] = []

  btnUpload

  constructor(private messageService: MessageService, private http: HttpClient, private fileService: FileService) { }
  room
  getMessage() {
    let param = { 'student': localStorage.getItem('userEmail') }
    this.http.get<any>(this.roomUrl, { params: param }).pipe(
      map((data) => {
        localStorage.setItem('room', data.room_id)
        this.room = localStorage.getItem('room')
        this.messageService.socket.emit('get', localStorage.getItem('room'))
      })
    ).subscribe()

    // this.messageService.socket.emit('get',localStorage.getItem('room'))
    return Observable.create((observer) => {
      this.messageService.socket.on('get', (data) => {
        observer.next(data)
      })
    })
  }

  ngOnInit(): void {
    this.getMessage().subscribe((data) => {
      this.listMessage = data;
    })
    this.messageService.socket.on('message', (data) => {
      this.listMessage.push(data)

    })
    this.room = localStorage.getItem('room')
    this.getListFile()
  }

  ngOnDestroy(): void { }

  send() {
    //send data Message
    this.fullMessage = new Message()
    this.fullMessage.content = this.message
    this.fullMessage.room = parseInt(localStorage.getItem('room'))
    this.fullMessage.by = localStorage.getItem('userEmail')
    this.fullMessage.at = formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss', 'en-US')

    this.messageService.send(this.fullMessage)
    this.message = ''
    this.messageService.socket.emit('message', this.fullMessage)

  }

  checkSender(m) {
    if (m.upload_by === localStorage.getItem('userEmail')) {
      return true
    }
  }

  show() {
    this.isShowMessage = !this.isShowMessage
  }

  // 
  // select file
  onFileSelected(event) {

    this.selectedFile = <File>event.target.files[0]

  }
  // upload files
  onUpload() {
    this.fileService.onUpload(this.selectedFile, this.selectedFile.name, this.room).subscribe(
      (event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.process = Math.round(event.loaded / event.total * 100)
            console.log(this.process)
            break;
          case HttpEventType.Response:
            console.log('User successfully created!', event.body);
            setTimeout(() => {
              this.process = 0;
            }, 1000);
        }
      }
    )
    setTimeout(() => {
      this.getListFile()
    }, 500)

  }

  // get list files
  getListFile() {
    console.log(this.room)
    this.fileService.getListFile(this.room).subscribe(data => {
      this.listFile = data
      console.log(data)
    })
  }

  // dowload file
  download(file_name, path) {
    this.fileService.dowloadFile(file_name, path)
  }

    // show and hide chat message
    isShowMessage = false
    showMessage() {
      this.isShowMessage = true
      this.isShowFile = false
      this.isShowTimeTable = false
      this.isShowDashboard = false
    }
  
    isShowFile = true
    showFile() {
      this.isShowFile = true
      this.isShowMessage = false
      this.isShowTimeTable = false
      this.isShowDashboard = false
    }
  
    isShowTimeTable = false
    showTimeTable(){
      this.isShowTimeTable = true
      this.isShowMessage = false
      this.isShowFile = false
      this.isShowDashboard = false
    }

    isShowDashboard =  false 
    showDashboard(){
      this.isShowDashboard = true
      this.isShowTimeTable = false
      this.isShowMessage = false
      this.isShowFile = false
    }
}
