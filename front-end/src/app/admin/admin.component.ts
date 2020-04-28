import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  

  constructor(private http:HttpClient) { }

  dataSourceTutor = new MatTableDataSource()
  dataSourceStudent = new MatTableDataSource()
  dataSourceStaff = new MatTableDataSource()
  displayedColumnsTutor: string[] = ['student','name','room', 'm_send', 'm_receive','d_send','d_receive']
  displayedColumnsStudent:string[] =  ['Actions', 'Last3days', 'Last7days', 'Last14days', 'Last28days']
  displayedColumnsStaff:string[] = ['staff_email','staff_name','actions']
  sort;

  dataSource1
  @ViewChild(MatSort, { static: false }) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSourceTutor.sort = this.sort;
    }
  }
  

  listValue
  selectedValue
  role
  ngOnInit(): void {
   
  } 

  viewStudentDashboard(){
    this.role = 'student'
    this.listValue = []
    let urlTutor = 'http://localhost:2222/getallstudent'
    this.http.get(urlTutor).subscribe((data: any) => {
      this.listValue = data
    })
    console.log(this.listValue)
  }

  viewStaffDashboard(){
    this.role = 'staff'
    this.listValue = []
    let urlTutor = 'http://localhost:2222/getallstaff'
    this.http.get(urlTutor).subscribe((data: any) => {
      this.listValue = data
    })
    console.log(this.listValue)
  }

  viewTutorDashboard(){
    this.role = 'tutor'
    this.listValue = []
    let urlTutor = 'http://localhost:2222/getalltutor'
    this.http.get(urlTutor).subscribe((data: any) => {
      this.listValue = data
    })
    console.log(this.listValue)
  }
  getListStudent(){

  }
  
  searchTutor(){
    let param = { 'email': this.selectedValue }
    let url_message = 'http://localhost:2222/tutor_get_report_message_7'
    this.http.get<any>(url_message, { params: param }).subscribe(data => {
      this.dataSource1 = []
      for(let i of data){
        this.dataSource1.push(i)
      }
      console.log(this.dataSource1)
      this.dataSourceTutor.data = this.dataSource1
    })
  }
  searchStaff(){
    let param = { 'email': this.selectedValue }
    let url = 'http://localhost:2222/get_staff_report'
    this.http.get<any>(url, { params: param }).subscribe(data => {
      this.dataSource1 = []
      console.log(data)
        this.dataSource1.push(data)
      
      console.log(this.dataSource1)
      this.dataSourceStaff.data = this.dataSource1
    })
  }

  searchStudent(){
    this.dataSource1 = []
    let urlRoom  = 'http://localhost:2222/room'
    let paramRoom = { 'student': this.selectedValue }
    
    let url_report = 'http://localhost:2222/get_report'
    
    this.http.get<any>(urlRoom,{params:paramRoom}).subscribe((data1)=>{
      console.log(data1.room_id)
      if(data1.room_id){
        let paramEmail = { 'email': this.selectedValue,'room':data1.room_id}
        this.http.get<any>(url_report, { params: paramEmail }).subscribe(data => {
          console.log(data)
          this.dataSource1.push({ 'Actions': 'Messages', 'Last3days': data[0].mes.toString(), 'Last7days': data[1].mes.toString(), 'Last14days': data[2].mes.toString(), 'Last28days': data[3].mes.toString() })
          this.dataSource1.push({ 'Actions': 'Documents', 'Last3days': data[0].doc.toString(), 'Last7days': data[1].doc.toString(), 'Last14days': data[2].doc.toString(), 'Last28days': data[3].doc.toString() })
          this.dataSource1.push({ 'Actions': 'Events', 'Last3days': data[0].can.toString(), 'Last7days': data[1].can.toString(), 'Last14days': data[2].can.toString(), 'Last28days': data[3].can.toString() })
          console.log(this.dataSource1)
          this.dataSourceStudent.data = this.dataSource1
        })
      }else{
        alert('This student have no room')
      }

    })
    
    

  }
}
