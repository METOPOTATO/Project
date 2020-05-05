export class Message {
  id: number
  content: string
  at: string
  by: string
  room: number
}

export class Document {
  name: string
  title: string
  at: Date
  by: string
  full_path: string
  room: number
}

export class Event {
  title: string
  start: Date
  end: Date
  color: string
  room: number
}

export class Comments {
  content: string
  docId: string
}

export class UserDashboard {
  email: String
  room: String
}

export class DashboardData {

}
// ///////////////////////
export class Human {
  mail: String
  name: String
}

export class Room {
  id:number
  student_email: string
  tutor_email: string
  creator: string
}

export class Result {
  result: string
}