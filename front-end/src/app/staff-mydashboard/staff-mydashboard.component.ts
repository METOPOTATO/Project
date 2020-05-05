import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-staff-mydashboard',
  templateUrl: './staff-mydashboard.component.html',
  styleUrls: ['./staff-mydashboard.component.css']
})
export class StaffMydashboardComponent implements OnInit {
  dataSourceStaff = new MatTableDataSource()
  displayedColumnsStaff:string[] = ['staff_email','staff_name','actions']
  dataSource1: any[];
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.searchStaff()
  }
  searchStaff(){
    let param = { 'email': localStorage.getItem('userEmail') }
    let url = 'http://localhost:2222/get_staff_report'
    this.http.get<any>(url, { params: param }).subscribe(data => {
      this.dataSource1 = []
      console.log(data)
        this.dataSource1.push(data)
      
      console.log(this.dataSource1)
      this.dataSourceStaff.data = this.dataSource1
    })
  }

}
