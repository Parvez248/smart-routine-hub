"use client";

import { createContext, useContext } from "react";
import { seedClasses } from "@/data/seed";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { MyClass } from "@/lib/types";

type ClassesContextValue = {
  classes: MyClass[];
  addClass: (item: Omit<MyClass, "id">) => void;
  deleteClass: (id: string) => void;
  updateClass: (id: string, item: Partial<MyClass>) => void;
};

const ClassesContext = createContext<ClassesContextValue | null>(null);

export function ClassesProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useLocalStorage<MyClass[]>("srh.classes", seedClasses);

  function addClass(item: Omit<MyClass, "id">) {
    setClasses((current) => [{ ...item, id: crypto.randomUUID() }, ...current]);
  }

  function deleteClass(id: string) {
    setClasses((current) => current.filter((item) => item.id !== id));
  }

  function updateClass(id: string, item: Partial<MyClass>) {
    setClasses((current) => current.map((existing) => (existing.id === id ? { ...existing, ...item } : existing)));
  }

  return <ClassesContext.Provider value={{ classes, addClass, deleteClass, updateClass }}>{children}</ClassesContext.Provider>;
}

export function useClasses() {
  const context = useContext(ClassesContext);
  if (!context) throw new Error("useClasses must be used inside ClassesProvider");
  return context;
}
