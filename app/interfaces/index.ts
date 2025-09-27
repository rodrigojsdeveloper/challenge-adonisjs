import { DateTime } from "luxon"

export interface IStudent {
  name: string
  email: string
  registration: string
  birthDate: DateTime
}

export interface ITeacher {
  name: string
  email: string
  registration: string
  birthDate: DateTime
}

export interface IClassroom {
  roomNumber: string
  capacity: number
  isAvailable: boolean
  teacherId: string
}
