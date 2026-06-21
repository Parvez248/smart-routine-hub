import routine from "@/data/routine-data.json";

const dayMap: Record<string, string> = {
  Saturday: "Sat",
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tues",
  Wednesday: "Wed",
};

export function dayToRoutineDay(day: string) {
  return dayMap[day] ?? day;
}

export function currentDayName() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
}

export function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${suffix}`;
}

export function slotLabel(slotId: number) {
  return routine.timeSlots.find((slot) => slot.id === slotId)?.label ?? "";
}
