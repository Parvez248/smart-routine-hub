import type { MyClass } from "@/lib/types";
import { currentDayName } from "@/lib/time";

export function classStats(classes: MyClass[]) {
  const todayName = currentDayName();
  return {
    today: classes.filter((item) => item.day === todayName).length,
    thisWeek: classes.length,
    courses: new Set(classes.map((item) => item.courseCode)).size,
  };
}
