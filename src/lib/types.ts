export type ClassType = "Theory" | "Lab";

export interface Teacher {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  initials?: string;
}

export interface Course {
  code: string;
  name: string;
  type: ClassType;
}

export interface MyClass {
  id: string;
  courseCode: string;
  courseName: string;
  type: ClassType;
  day: string;
  timeSlotId?: number;
  slots?: number[];
  startTime: string;
  endTime: string;
  room: string;
  program: string;
  semester: string;
  sectionLabel?: string;
}

export interface TimeSlot {
  id: number;
  label: string;
  start: string;
  end: string;
}

export interface RoutineSession {
  day: "Sat" | "Sun" | "Mon" | "Tues" | "Wed";
  batch: string;
  semester: string;
  section: string | null;
  slots: number[];
  course: string;
  teacher: string;
  room: string;
}
