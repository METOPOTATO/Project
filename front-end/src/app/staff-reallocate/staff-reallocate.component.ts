import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Room } from '../classes';

@Component({
  selector: 'app-staff-reallocate',
  templateUrl: './staff-reallocate.component.html',
  styleUrls: ['./staff-reallocate.component.css']
})
export class StaffReallocateComponent implements OnInit {

  displayedColumns: string[] = ['select', 'tutor_email', 'student_email','room_id'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);
  currentStaff 
  constructor(private http:HttpClient) { }

  ngOnInit(): void {
    this.getRoomInfo()
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?): string {
    // if (!row) {
    //   return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    // }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  
  getRoomInfo(){
    let arr = []
    let urlStudent = 'http://localhost:2222/get_room'
    this.http.get(urlStudent).subscribe((data: any) => {
      console.log(data)
      for (let i of data) {
        arr.push(i)
      }
      this.dataSource.data = arr
    })
  }
  selected = []
  selectRow() {
    // console.log(row)
    console.log('select box')
    this.selected = []
    for (let i of this.selection.selected) {
      this.selected.push(i)
    }
    console.log(this.selected)
    console.log(this.selection.selected)
  }

  selectRowH($event, row) {
    this.selected = []
    console.log($event)
    if ($event.checked == true) {
      console.log('checked')
      this.selection.select(row)
    } else {
      console.log('unchecked')
      this.selection.deselect(row)
    }
    for (let i of this.selection.selected) {
      this.selected.push(i)
    }
    console.log(this.selected)
    console.log(this.selection.selected)
  }

  remove() {
    let arr = this.dataSource.data
    for (let j in this.dataSource.data) {
      for (let i in this.selection.selected) {
        if (this.selection.selected[i] === this.dataSource.data[j]) {
          arr = arr.filter(data => data !== this.dataSource.data[j])
        }
      }
    }
    this.dataSource.data = arr
  }
  reallocate(){
    this.remove()
    let urlReallocate = 'http://localhost:2222/reallocation'
      let sendMailUrl = 'http://localhost:2222/sendmail_reallocation'
      for (let i in this.selected) {
        let room: Room = new Room()
        room.student_email = this.selected[i].tutor_email
        room.tutor_email = this.selected[i].student_email
        room.id =  this.selected[i].room_id
        console.log(room.id)
        this.http.post<any>(urlReallocate, room).subscribe()
        this.http.post<any>(sendMailUrl,room).subscribe()
      }
  }
}
