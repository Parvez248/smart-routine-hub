"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, BookOpen, CheckCircle2, Plus, XCircle } from "lucide-react";
import routine from "@/data/routine-data.json";
import { TopBar } from "@/components/TopBar";
import { useClasses } from "@/context/ClassesContext";
import { courseCatalog, days, programs, rooms, semesters } from "@/data/seed";
import type { ClassType } from "@/lib/types";
import { availabilityForRooms, hubSessionsForAvailability, isRoomBusy, isTeacherBusy } from "@/lib/availability";
import { formatTime } from "@/lib/time";

export default function AddClassPage() {
  const router = useRouter();
  const { classes, addClass } = useClasses();
  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [type, setType] = useState<ClassType>("Theory");
  const [day, setDay] = useState("");
  const [slots, setSlots] = useState<number[]>([]);
  const [room, setRoom] = useState("");
  const [program, setProgram] = useState("BSc");
  const [semester, setSemester] = useState("1st Semester");
  const [message, setMessage] = useState("");

  const startTime = slots[0] ? formatTime(routine.timeSlots.find((slot) => slot.id === slots[0])!.start) : "";
  const endTime = slots.length ? formatTime(routine.timeSlots.find((slot) => slot.id === slots[slots.length - 1])!.end) : "";
  const availability = useMemo(() => (day && slots.length ? availabilityForRooms(rooms, day, slots, classes) : []), [classes, day, slots]);
  const blocked = day && room && slots.length ? isRoomBusy(room, day, slots, [...hubSessionsForAvailability(), ...classes]) || isTeacherBusy(day, slots, classes) : false;

  function pickCourse(code: string) {
    const course = courseCatalog.find((item) => item.code === code);
    setCourseCode(code);
    if (course) {
      setCourseName(course.name);
      setType(course.type);
    }
  }

  function pickSlot(value: string) {
    if (!value) {
      setSlots([]);
      return;
    }
    const picked = Number(value);
    setSlots([picked]);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (!courseCode || !day || !room || !slots.length) {
      setMessage("Select a course, day, time slot, and room.");
      return;
    }
    if (blocked) {
      setMessage("That room or teacher time is already occupied. Pick another slot or room.");
      return;
    }
    addClass({ courseCode, courseName, type, day, timeSlotId: slots[0], slots, startTime, endTime, room, program, semester });
    router.push("/");
  }

  return (
    <>
      <TopBar title="Add New Class" subtitle="Select a course and check room availability before adding." />
      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-2xl bg-[var(--surface)] p-6 shadow-sm ring-1 ring-slate-200/70 dark:ring-white/10">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/12 text-emerald-600"><Plus size={22} /></div>
            <div>
              <h2 className="font-[var(--font-poppins)] text-2xl font-bold">Class Details</h2>
              <p className="text-sm text-[var(--muted)]">Required fields are marked with an asterisk.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Select Course *">
              <select value={courseCode} onChange={(event) => pickCourse(event.target.value)} className="field">
                <option value="">Choose course</option>
                {courseCatalog.map((course) => <option key={course.code} value={course.code}>{course.code} · {course.name}</option>)}
              </select>
            </Field>
            <Field label="Course Code">
              <input value={courseCode} onChange={(event) => setCourseCode(event.target.value)} className="field" placeholder="CSE301" />
            </Field>
            <Field label="Class Type">
              <select value={type} onChange={(event) => setType(event.target.value as ClassType)} className="field">
                <option>Theory</option>
                <option>Lab</option>
              </select>
            </Field>
            <Field label="Course Name">
              <input value={courseName} onChange={(event) => setCourseName(event.target.value)} className="field" placeholder="Digital Signal Processing" />
            </Field>
            <Field label="Day *">
              <select value={day} onChange={(event) => setDay(event.target.value)} className="field">
                <option value="">Choose day</option>
                {days.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Time Slot *">
              <select value={slots[0] ?? ""} onChange={(event) => pickSlot(event.target.value)} className="field">
                <option value="">Choose slot</option>
                {routine.timeSlots.map((slot) => <option key={slot.id} value={slot.id}>{slot.label}</option>)}
              </select>
            </Field>
            <Field label="Start Time">
              <input value={startTime} readOnly className="field" placeholder="Auto-filled" />
            </Field>
            <Field label="End Time">
              <input value={endTime} readOnly className="field" placeholder="Auto-filled" />
            </Field>
            <Field label="Program">
              <select value={program} onChange={(event) => setProgram(event.target.value)} className="field">
                {programs.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Semester">
              <select value={semester} onChange={(event) => setSemester(event.target.value)} className="field">
                {semesters.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
          </div>
          {message && <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 dark:bg-rose-950/30">{message}</p>}
          <button className="mt-6 w-full rounded-xl bg-[image:var(--brand-gradient)] px-5 py-3 font-bold text-white shadow-lg shadow-emerald-500/20">Add Class</button>
        </section>
        <aside className="rounded-2xl bg-[var(--surface)] p-6 shadow-sm ring-1 ring-slate-200/70 dark:ring-white/10">
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="text-emerald-600" size={21} />
            <h2 className="font-[var(--font-poppins)] text-xl font-bold">Select Room</h2>
          </div>
          {!day || !slots.length ? (
            <div className="rounded-2xl bg-amber-50 p-4 text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:ring-amber-500/20">
              <div className="mb-2 flex items-center gap-2 font-bold"><AlertTriangle size={18} /> Select Day & Time First</div>
              <p className="text-sm">Room availability will be shown based on your selected time slot.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {availability.map((item) => (
                <button
                  key={item.room}
                  type="button"
                  disabled={item.busy}
                  onClick={() => setRoom(item.room)}
                  className={`rounded-xl border px-3 py-3 text-left text-sm font-bold transition ${
                    room === item.room
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30"
                      : item.busy
                        ? "cursor-not-allowed border-rose-200 bg-rose-50 text-rose-500 opacity-75 dark:border-rose-500/20 dark:bg-rose-950/30"
                        : "border-slate-200 bg-slate-50 text-[var(--text)] hover:border-emerald-400 dark:border-white/10 dark:bg-white/5"
                  }`}
                >
                  <span className="flex items-center justify-between">
                    Room {item.room}
                    {item.busy ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                  </span>
                  <span className="mt-1 block text-xs font-semibold opacity-75">{item.busy ? "Busy" : "Available"}</span>
                </button>
              ))}
            </div>
          )}
        </aside>
      </form>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-[var(--text)]">{label}</span>
      {children}
    </label>
  );
}
