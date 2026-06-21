import routine from "./routine-data.json";
import type { Course, MyClass, Teacher } from "@/lib/types";

export const demoTeacher: Teacher = {
  id: "t1",
  name: "Palash Shah",
  email: "palash@hub.edu",
  role: "Teacher Dashboard",
  department: "Computer Science & Engineering",
  initials: "PKS",
};

export const programs = ["BSc"];

export const semesters = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
];

export const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const rooms = ["101", "102", "109", "111", "116", "130", "131", "136", "137", "228", "249"];

export const courseCatalog: Course[] = [
  { code: "CSE223", name: "Software Engineering", type: "Theory" },
  { code: "CSE224", name: "Software Engineering Lab", type: "Lab" },
  { code: "CSE317", name: "Compiler Design", type: "Theory" },
  { code: "CSE318", name: "Compiler Design Lab", type: "Lab" },
  { code: "CSE301", name: "Digital Signal Processing", type: "Theory" },
  ...Array.from(new Set(routine.sessions.map((session) => session.course)))
    .filter((code) => !["CSE223", "CSE224", "CSE317", "CSE318"].includes(code))
    .slice(0, 28)
    .map((code) => ({
      code,
      name: `${code} Course`,
      type: code.endsWith("2") || code.endsWith("4") || code.endsWith("6") || code.endsWith("8") ? "Lab" : "Theory",
    } as Course)),
];

export const seedClasses: MyClass[] = [
  {
    id: "seed-1",
    courseCode: "CSE223",
    courseName: "Software Engineering",
    type: "Theory",
    day: "Saturday",
    timeSlotId: 1,
    slots: [1],
    startTime: "09:30 AM",
    endTime: "10:30 AM",
    room: "136",
    program: "BSc",
    semester: "4th Semester",
  },
  {
    id: "seed-2",
    courseCode: "CSE224",
    courseName: "Software Engineering Lab",
    type: "Lab",
    day: "Saturday",
    timeSlotId: 2,
    slots: [2, 3],
    startTime: "10:30 AM",
    endTime: "12:30 PM",
    room: "136",
    program: "BSc",
    semester: "4th Semester",
  },
  {
    id: "seed-3",
    courseCode: "CSE318",
    courseName: "Compiler Design Lab",
    type: "Lab",
    day: "Sunday",
    timeSlotId: 1,
    slots: [1, 2],
    startTime: "09:30 AM",
    endTime: "11:30 AM",
    room: "131",
    program: "BSc",
    semester: "5th Semester",
    sectionLabel: "Sec 2",
  },
  {
    id: "seed-4",
    courseCode: "CSE317",
    courseName: "Compiler Design",
    type: "Theory",
    day: "Monday",
    timeSlotId: 4,
    slots: [4],
    startTime: "12:30 PM",
    endTime: "01:30 PM",
    room: "130",
    program: "BSc",
    semester: "5th Semester",
    sectionLabel: "Sec 1",
  },
];
