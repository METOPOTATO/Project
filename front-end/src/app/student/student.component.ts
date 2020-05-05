import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MessageService } from '../message.service';
import { Message, Comments, UserDashboard } from '../classes'
import { Observable } from 'rxjs';

import { FileService } from 'src/app/file.service'
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { formatDate } from '@angular/common';
import { map } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};
export interface test {
  Actions: String
  Last3days: String
  Last7days: String
  Last14days: String
  Last28days: String
}
const data: test[] = [
  { Actions: 'Messages', Last3days: "1", Last7days: "2", Last14days: "3", Last28days: "4" },
  { Actions: 'Documents', Last3days: '5', Last7days: '6', Last14days: '7', Last28days: '8' },
  { Actions: 'Events', Last3days: '9', Last7days: '10', Last14days: '11', Last28days: '12' }]
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit, OnDestroy, AfterViewInit {
  fullMessage: Message
  message: string
  listMessage: Message[]

  private roomUrl = 'http://localhost:2222/room'


  selectedFile

  process: number = 0
  listFile: Document[] = []

  btnUpload

  //for dash board
  displayedColumns: string[] = ['Actions', 'Last3days', 'Last7days', 'Last14days', 'Last28days']
  dataSource = new MatTableDataSource()
  // @ViewChild(MatSort, { static: true }) sort: MatSort;
  sort;
  @ViewChild(MatSort, { static: false }) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  dataSource1 = []

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    private fileService: FileService,
    private router: Router
  ) {
    let param = { 'student': localStorage.getItem('userEmail') }
    this.http.get<any>(this.roomUrl, { params: param }).pipe(
      map((data) => {
        if (data != null) {
          localStorage.setItem('room', data.room_id)
          this.room = localStorage.getItem('room')
          //for messages
          this.getMessage().subscribe((data) => {
            this.listMessage = data;
          })
          // for list file
          this.getListFile()
          //for report
          let param = { 'email': localStorage.getItem('userEmail'), 'room': this.room }
          let url_report = 'http://localhost:2222/get_report'
          this.http.get<any>(url_report, { params: param }).subscribe(data => {
            console.log(data)
            this.dataSource1.push({ 'Actions': 'Messages', 'Last3days': data[0].mes.toString(), 'Last7days': data[1].mes.toString(), 'Last14days': data[2].mes.toString(), 'Last28days': data[3].mes.toString() })
            this.dataSource1.push({ 'Actions': 'Documents', 'Last3days': data[0].doc.toString(), 'Last7days': data[1].doc.toString(), 'Last14days': data[2].doc.toString(), 'Last28days': data[3].doc.toString() })
            this.dataSource1.push({ 'Actions': 'Events', 'Last3days': data[0].can.toString(), 'Last7days': data[1].can.toString(), 'Last14days': data[2].can.toString(), 'Last28days': data[3].can.toString() })
            console.log(this.dataSource1)
            this.dataSource.data = this.dataSource1
          })
        }
      })
    ).subscribe()


  }
  room
  getMessage() {
    this.messageService.socket.emit('get', localStorage.getItem('room'))
    return Observable.create((observer) => {
      this.messageService.socket.on('get', (data) => {
        observer.next(data)
      })
    })
  }

  isShowNavBar = true
  userName
  ngOnInit(): void {
    this.userName = localStorage.getItem('userName')
    this.dataSource.sort = this.sort;
    this.messageService.socket.on('message', (data) => {
      console.log(data)
      this.listMessage.push(data)
    })

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void { }

  send() {
    //send data Message
    if (localStorage.getItem('room')) {
      this.fullMessage = new Message()
      this.fullMessage.content = this.message
      this.fullMessage.room = parseInt(localStorage.getItem('room'))
      this.fullMessage.by = localStorage.getItem('userEmail')
      this.fullMessage.at = formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss', 'en-US')
      this.messageService.send(this.fullMessage)
      this.message = ''
      this.messageService.socket.emit('message', this.fullMessage)
    } else {
      alert('You dont have a room yet')
    }
  }
  sendk($event) {
    //send data Message
    if (localStorage.getItem('room')) {
      this.fullMessage = new Message()
      this.fullMessage.content = this.message
      this.fullMessage.room = parseInt(localStorage.getItem('room'))
      this.fullMessage.by = localStorage.getItem('userEmail')
      this.fullMessage.at = formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss', 'en-US')
      this.messageService.send(this.fullMessage)
      this.message = ''
      this.messageService.socket.emit('message', this.fullMessage)
    } else {
      alert('You dont have any contact with tutor')
    }
  }

  checkSender(m) {
    if (m.upload_by === localStorage.getItem('userEmail')) {
      return true
    }
  }

  show() {
    this.isShowMessage = !this.isShowMessage
  }

  // select file
  onFileSelected(event) {
    if (localStorage.getItem('room')) {
      this.selectedFile = <File>event.target.files[0]
    } else {
      alert('You dont have any contact with tutor')
    }
  }
  // upload files
  onUpload() {
    if (this.selectedFile) {
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
    } else {
      alert('No file choosen')
    }

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

  isShowFile = false
  showFile() {
    this.isShowFile = true
    this.isShowMessage = false
    this.isShowTimeTable = false
    this.isShowDashboard = false
  }

  isShowTimeTable = false
  showTimeTable() {
    this.isShowTimeTable = true
    this.isShowMessage = false
    this.isShowFile = false
    this.isShowDashboard = false
  }

  isShowDashboard = true
  showDashboard() {
    this.isShowDashboard = true
    this.isShowTimeTable = false
    this.isShowMessage = false
    this.isShowFile = false
  }

  selectedDateStart
  selectedDateEnd
  searchDashboard() {
    let param = { 'start': this.selectedDateStart, 'end': this.selectedDateEnd, 'room': this.room }
    console.log(param)
    let url_message = 'http://localhost:2222/dashboard_message'
    this.http.get<any>(url_message, { params: param }).subscribe(data => {
      console.log(data.length)
      for (let i of data) {
        console.log(i)
      }
    })
  }


  getDefaultDashboard() {
    console.log('default')
    let user: UserDashboard = new UserDashboard()
    user.room = this.room
    user.email = localStorage.getItem('userEmail')

    this.messageService.socket.emit('get_report', user)
  }

  url_comment = 'http://localhost:2222/add_comment'
  comment
  sendComment(event,file_id) {
    let co: Comments = new Comments()
    co.content = event.target.value
    co.docId = file_id
    this.http.put<any>(this.url_comment, co, httpOptions).subscribe()
    event.target.value = ""
    // alert('send comment successfully')
  }

  url_show_comment
  comments
  showComment(file_id) {
    this.messageService.socket.emit('get_comment', file_id)
    this.messageService.socket.on('get_comment', (data) => {
      this.comments = data
    })
  }

  // dashboard 

}
