
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { startOfDay, endOfDay, isSameDay, isSameMonth, parseISO } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';

import * as io from 'socket.io-client';
import { ActivatedRoute } from "@angular/router";
import { Event } from '../classes'
import { da } from 'date-fns/locale';
import { timeout } from 'rxjs/operators';
import { RoomComponent } from '../tutor/room/room.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})

export class TimetableComponent implements OnInit {

  ngOnInit(): void {

  }

  roomsUrl
  listRooms

  room
  list = []
  constructor(private route: ActivatedRoute, private rc: RoomComponent, private http: HttpClient) {
    this.socket = io(this.url)

    if (localStorage.getItem('userRole') == "tutor") {
      rc.getRoom().subscribe(data => {
        this.room = data.get('id')
        // 
        this.socket.emit('get_calendar', this.room)

        this.socket.on('get_calendar_1', data => {
          this.events = []
          for (let i of data) {
            let t = {
              title: i.title,
              start: parseISO(i.time_start),
              end: parseISO(i.time_end),
              color: i.corlor,
              actions: this.actions,
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
            }
            this.events.push(t)

          }
          this.refresh.next()
        })
      })
    }

    if (localStorage.getItem('userRole') == "student") {
      this.room = localStorage.getItem('room')
      this.socket.emit('get_calendar', this.room)

        this.socket.on('get_calendar_1', data => {
          this.events = []
          for (let i of data) {
            let t = {
              title: i.title,
              start: parseISO(i.time_start),
              end: parseISO(i.time_end),
              color: i.corlor,
              actions: this.actions,
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
            }
            this.events.push(t)

          }
          this.refresh.next()
        })
    }

    this.socket.on('calendar', data => {

      this.title = data.title
      this.start = data.start
      this.end = data.end
      this.color = data.color
      console.log(this.title)
      let t = {
        title: this.title,
        start: parseISO(this.start.toString()),
        end: parseISO(this.end.toString()),
        color: this.color,
        actions: this.actions,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      }
      this.events.push(t)
      this.refresh.next()
    })
  }
  public socket
  private url = 'http://localhost:2222';

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [
  ];
  activeDayIsOpen: boolean;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  title = "new event"
  start = startOfDay(new Date())
  end = endOfDay(new Date())
  color = colors.blue
  addEvent(): void {
    if(localStorage.getItem('userRole')=='student' && !localStorage.getItem('room')){
      alert('You dont have a room yet')
    }else{
      let myEvent = new Event()
      myEvent.title = this.title
      myEvent.start = this.start
      myEvent.end = this.end
      myEvent.color = this.color
      myEvent.room = this.room
      this.socket.emit('calendar', myEvent)
      this.socket.emit('add_calendar', myEvent)
    }
  }


  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });

  }

  show = false

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log(event.title)
    this.show = !this.show
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
