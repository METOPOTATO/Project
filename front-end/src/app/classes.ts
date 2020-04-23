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