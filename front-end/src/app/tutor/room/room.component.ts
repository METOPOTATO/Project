import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TutorService } from 'src/app/tutor.service';
import { Message, Document,Comments } from 'src/app/classes';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { Observable } from 'rxjs';
import { FileService } from 'src/app/file.service'
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';

import { ThrowStmt } from '@angular/compiler';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};
@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})

export class RoomComponent implements OnInit,OnDestroy {
  fullMessage: Message
  message
  messages = []
  room
  

  selectedFile

  process: number = 0
  listFile: Document[] = []

  btnUpload
  
  constructor(private service: TutorService, private route: ActivatedRoute, private fileService: FileService, private http: HttpClient) {
    
     this.getMessages().subscribe((data) => {
      this.messages = data
    })
    this.route.paramMap.subscribe((data) => {
      this.room = data.get('id')
      console.log(this.room)
      this.getListFile()
      this.getButton()
    })
    
    this.service.socket.on('message', (data) => {
      this.messages.push(data)
    })
    this.getRoom()
  }

  getRoom(){
    return Observable.create((observer) => {
      this.route.paramMap.subscribe((data) => {
        observer.next(data)
      })
    })
  }

  ngOnDestroy(){

  }

  public getMessages() {
    this.route.paramMap.subscribe((data) => {
      this.service.socket.emit('get_calendar', this.room)
      this.service.socket.emit('get', data.get('id'))
    })
    return Observable.create((observer) => {
      this.service.socket.on('get', (data) => {
        observer.next(data)
      })
    })
  }

  ngOnInit(): void {

  }

  // send message
  public send() {
    this.fullMessage = new Message()
    this.fullMessage.room = this.room
    this.fullMessage.content = this.message
    this.fullMessage.by = localStorage.getItem('userEmail')
    this.fullMessage.at = formatDate(Date.now(), 'yyyy-MM-dd h:mm:ss', 'en-US')
    this.service.send(this.fullMessage)
    this.message = ''
    this.service.socket.emit('message', this.fullMessage)
  }

  sendk($event) {
    //send data Message
    this.fullMessage = new Message()
    this.fullMessage.room = this.room
    this.fullMessage.content = this.message
    this.fullMessage.by = localStorage.getItem('userEmail')
    this.fullMessage.at = formatDate(Date.now(), 'yyyy-MM-dd h:mm:ss', 'en-US')
    this.service.send(this.fullMessage)
    this.message = ''
    this.service.socket.emit('message', this.fullMessage)

  }
  // check who is sender
  checkSender(m) {
    if (m.upload_by === localStorage.getItem('userEmail')) {
      return true
    }
  }

  // show and hide chat message
  isShowMessage = false
  showMessage() {
    this.isShowMessage = true
    this.isShowFile = false
    this.isShowTimeTable = false
  }

  isShowFile = true
  showFile() {
    this.isShowFile = true
    this.isShowMessage = false
    this.isShowTimeTable = false
  }

  isShowTimeTable = false
  showTimeTable(){
    this.isShowTimeTable = true
    this.isShowMessage = false
    this.isShowFile = false
  }
  
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
    setTimeout(()=>{
      this.getListFile()
    },500)
    
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

  // get button
  getButton(){
    this.route.paramMap.subscribe(data=>{
      this.btnUpload = data.get('id')
      
    })
  }

  url_comment = 'http://localhost:2222/add_comment'
  comment
  sendComment(event,file_id){
    let co:Comments = new Comments()
    co.content = event.target.value
    co.docId =  file_id
    this.http.put<any>(this.url_comment,co,httpOptions).subscribe()
    event.target.value = ""
  }

  url_show_comment
  comments
  showComment(file_id){
    this.service.socket.emit('get_comment',file_id)
    this.service.socket.on('get_comment',(data)=>{
      this.comments = data
    })
  }
}
