import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { User, Token } from './User';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})

export class MyService implements CanActivate {

  public role: string;
  private token: string;
  private getUrl = "http://127.0.0.1:2222/get"
  private loginUrl = "http://127.0.0.1:2222/login"
  private roomUrl = "http://127.0.0.1:2222/room"
  constructor(private http: HttpClient, private router: Router) { }

  getList(): Observable<User[]> {
    return this.http.get<User[]>(this.getUrl)
  }

  login(user: User) {
    return this.http.post(this.loginUrl, user, httpOptions).pipe(map((data: Token) => {
      if (data.token) {
        this.saveToken(data.token)
        this.saveUser(data)
        console.log(data)
        if (data.role != '' && data.role != null) {
          const link = "/" + data.role
          this.router.navigateByUrl(link)
        }
      } else {
        alert('wrong email and password')
      }
    })).toPromise().then()
  }

  saveUser(token: Token) {
    localStorage.setItem('userEmail', token.email)
    localStorage.setItem('userRole', token.role)
    this.role = token.role
    console.log(this.role)
    localStorage.setItem('userName', token.name)
      if (localStorage.getItem('userRole') == 'student') {
        let param = { 'student': localStorage.getItem('userEmail') }
        this.http.get<any>(this.roomUrl, { params: param }).pipe(
          map((data) => {
            if (data != null) {
              console.log(data)
              localStorage.setItem('room', data.room_id)
            }
          })
        ).subscribe()
      } 
  }

  saveToken(token: string): void {
    localStorage.setItem('usertoken', token)
    this.token = token
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('usertoken')
    }
    return this.token
  }

  public isLoggedIn(): boolean {
    if (this.getToken()) {
      return true
    } else {
      return false
    }
  }

  public logout(): void {
    this.token = ''
    this.role = ''
    window.localStorage.removeItem('usertoken')
    window.localStorage.removeItem('userRole')
    window.localStorage.removeItem('userEmail')
    window.localStorage.removeItem('room')
    this.router.navigateByUrl('/')
  }

  canActivate(next: ActivatedRouteSnapshot) {
    if (!localStorage.getItem('usertoken')) {
      this.router.navigateByUrl('/')
      console.log(this.token)
      return false
    }
    let role = next.data['role'] as Array<string>
    if (role != null) {
      if (role[0] != localStorage.getItem('userRole')) {
        this.router.navigateByUrl('/forbidden')
        return false
      }
    }
    return true
  }

  public checkRole() {
    return localStorage.getItem('userRole')
  }
}


