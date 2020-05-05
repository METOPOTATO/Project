import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-tutor-dashboard',
  templateUrl: './tutor-dashboard.component.html',
  styleUrls: ['./tutor-dashboard.component.css']
})
export class TutorDashboardComponent implements OnInit {

  constructor(private http: HttpClient) { }
  dataSource = new MatTableDataSource()
  displayedColumns: string[] = ['student','name','room', 'm_send', 'm_receive','d_send','d_receive','events']
  sort;
  @ViewChild(MatSort, { static: false }) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  dataSource1 = []
  report = []
  case 
  ngOnInit(): void {
    this.getMessages_7()
    this.getTotalMessages()
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getMessages_7() {
    this.case = 7
    let param = { 'email': localStorage.getItem('userEmail') }
    let url_message = 'http://localhost:2222/tutor_get_report_message_7'
    this.http.get<any>(url_message, { params: param }).subscribe(data => {
      console.log(data)
      this.dataSource1 = []
      this.report = []
      for(let i of data){
        this.dataSource1.push(i)
        if(i.m_receive == 0 && i.d_receive == 0 && i.events ==0){
          this.report.push(i)
        }
        
      }
      console.log(this.dataSource1)
      this.dataSource.data = this.dataSource1

    })
  }
  getMessages_28() {
    this.case = 28
    let param = { 'email': localStorage.getItem('userEmail') }
    let url_message = 'http://localhost:2222/tutor_get_report_message_28'
    this.http.get<any>(url_message, { params: param }).subscribe(data => {
      this.dataSource1 = []
      this.report = []
      for(let i of data){
        this.dataSource1.push(i)
        if(i.m_receive == 0 && i.d_receive == 0 && i.events ==0){
          this.report.push(i)
        }
      }
      console.log(this.dataSource1)
      this.dataSource.data = this.dataSource1

    })
  }
  totalMessages
  averageMessages
  getTotalMessages(){
    let param = { 'email': localStorage.getItem('userEmail')}
    let url_message = 'http://localhost:2222/get_all_tutor_messages'
    this.http.get<any>(url_message,{params:param}).subscribe((data)=>{
      console.log(data)
      this.totalMessages = data[0].tutor_messages 
      this.averageMessages = this.totalMessages / data[0].tutor_students
      console.log(this.totalMessages)
      console.log(this.averageMessages)
    })
  }
}
