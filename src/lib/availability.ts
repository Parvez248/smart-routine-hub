import routine from "@/data/routine-data.json";
import type { MyClass } from "@/lib/types";
import { dayToRoutineDay } from "@/lib/time";

type SessionLike = {
  day: string;
  room: string;
  slots?: number[];
  timeSlotId?: number;
};

export function slotsForClass(item: SessionLike) {
  return item.slots?.length ? item.slots : item.timeSlotId ? [item.timeSlotId] : [];
}

export function intersects(a: number[], b: number[]) {
  return a.some((slot) => b.includes(slot));
}

export function hubSessionsForAvailability() {
  return routine.sessions.map((session) => ({
    day: session.day,
    room: session.room,
    slots: session.slots,
  }));
}

export function isRoomBusy(room: string, day: string, slots: number[], sessions: SessionLike[]) {
  const routineDay = dayToRoutineDay(day);
  return sessions.some((session) => {
    const sessionDay = dayToRoutineDay(session.day);
    return session.room === room && sessionDay === routineDay && intersects(slotsForClass(session), slots);
  });
}

export function isTeacherBusy(day: string, slots: number[], classes: MyClass[]) {
  const routineDay = dayToRoutineDay(day);
  return classes.some((item) => dayToRoutineDay(item.day) === routineDay && intersects(slotsForClass(item), slots));
}

export function availabilityForRooms(rooms: string[], day: string, slots: number[], myClasses: MyClass[]) {
  const sessions = [...hubSessionsForAvailability(), ...myClasses];
  return rooms.map((room) => ({
    room,
    busy: isRoomBusy(room, day, slots, sessions),
  }));
}
