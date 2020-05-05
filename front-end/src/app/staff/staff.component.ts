import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { Room } from 'src/app/classes'
import { Router} from '@angular/router'
@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})

export class StaffComponent {
  displayedColumns: string[] = ['select', 'mail', 'name'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);
  currentStaff 
  
  constructor(private http: HttpClient,private router:Router) {
    this.getDataStudent()
    this.getDataTutor()
    this.currentStaff = localStorage.getItem('userName')
  }
  /** Whether the number of selected elements matches the total number of rows. */
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
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  selected = []
  selectRow() {
    // console.log(row)
    this.selected = []
    for (let i of this.selection.selected) {
      this.selected.push(i)
    }
    console.log(this.selected)
    console.log(this.selection.selected)
  }

  selectRowH($event, row) {
    this.selected = []
    if ($event.checked) {
      this.selection.select(row)
    } else {
      this.selection.deselect(row)
    }
    for (let i of this.selection.selected) {
      this.selected.push(i)
    }
    console.log(this.selected)
    console.log(this.selection.selected)
  }

  getDataStudent() {
    let arr = []
    let urlStudent = 'http://localhost:2222/get_available_students'
    this.http.get(urlStudent).subscribe((data: any) => {
      for (let i of data) {
        arr.push(i)
      }
      this.dataSource.data = arr
    })
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

  selectedTutor;
  listTutor = []
  getDataTutor() {
    let urlTutor = 'http://localhost:2222/getalltutor'
    this.http.get(urlTutor).subscribe((data: any) => {
      this.listTutor = data
    })
    console.log(this.listTutor)
  }

  allocate() {
    if (this.selected.length == 0) {
      alert('You must select a student')
    } else if (this.selectedTutor == null) {
      alert('You must select a tutor')
    } else {
      this.remove()
      let urlAllocate = 'http://localhost:2222/allocation'
      let sendMailUrl = 'http://localhost:2222/sendmail'
      for (let i in this.selected) {
        let room: Room = new Room()
        room.creator = localStorage.getItem('userEmail')
        room.student_email = this.selected[i].mail
        room.tutor_email = this.selectedTutor
        this.http.post<any>(urlAllocate, room).subscribe()
        this.http.post<any>(sendMailUrl,room).subscribe()
      }
    }
  }
  saveTutorDashboard(){
    if(this.selectedTutor!=null){
      localStorage.setItem('tutorDashboard',this.selectedTutor)
      localStorage.setItem('userRoleDashboard','tutor')
    }else{
      alert('You didnot select a tutor')
      this.router.navigateByUrl('staff')
    }
    
  }
}
