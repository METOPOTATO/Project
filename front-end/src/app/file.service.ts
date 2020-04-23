import { Injectable, ɵɵresolveBody } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpEvent, HttpEventType } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Document } from 'src/app/classes'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FileService {
  // selectedFile
  // title
  process: number = 0
  constructor(private http: HttpClient) { }


  onUpload(selectedFile, title, room) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Accept': 'multipart/form-data' }),
      observe: 'response',
      reportProgress: true
    };
    let date = formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss', 'en-US')
    let full_path = room + date + selectedFile.name
    const fd = new FormData()
    fd.append('file', selectedFile, selectedFile.name)
    fd.append('title', title)
    fd.append('at', date)
    fd.append('by', localStorage.getItem('userEmail'))
    fd.append('full_path', full_path)
    fd.append('room', room)
    console.log('on upload');
    return this.http.post('http://127.0.0.1:2222/upload', fd, {
      reportProgress: true,
      observe: 'events'
    })
  }

  getListFile(room) {
    let param = new HttpParams().set('room', room);
    return this.http.get<any>('http://127.0.0.1:2222/list_files', { params: param })
  }

  dowloadFile(file_name,path) {
    let param = new HttpParams().set('path', path);
    return this.http.get('http://127.0.0.1:2222/download', { responseType: "blob",params:param }).subscribe(res => {
      var url = window.URL.createObjectURL(res);
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = file_name;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
  }
}
