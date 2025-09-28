import { DateTime } from "luxon";

export interface StudentProps {
  name: string;
  email: string;
  registration: string;
  birthDate: DateTime;
}

export interface TeacherProps {
  name: string;
  email: string;
  registration: string;
  birthDate: DateTime;
}

export interface ClassroomProps {
  roomNumber: string;
  capacity: number;
  isAvailable: boolean;
  teacherId: string;
}
