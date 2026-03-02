import { useState, useEffect, useCallback } from "react";

export interface GratitudeEntry {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  createdAt: number;
  plantVariant: number; // index into plant variants
  gardenX: number; // 0-100 horizontal position percentage
  gardenY: number; // 0-100 vertical offset percentage
}

const STORAGE_KEY = "gratitude-garden-entries";
const TOTAL_PLANT_VARIANTS = 10;

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function useGratitudeStore() {
  const [entries, setEntries] = useState<GratitudeEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      // Migrate old entries without plantVariant/position
      return parsed.map((e: any, i: number) => ({
        ...e,
        plantVariant: e.plantVariant ?? i % TOTAL_PLANT_VARIANTS,
        gardenX: e.gardenX ?? Math.round(5 + (i * 90) / Math.max(parsed.length, 1)),
        gardenY: e.gardenY ?? Math.round(Math.random() * 40),
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const today = getToday();
  const todayEntry = entries.find((e) => e.date === today);
  const hasEntryToday = !!todayEntry;

  const addEntry = useCallback(
    (text: string) => {
      const entry: GratitudeEntry = {
        id: crypto.randomUUID(),
        date: today,
        text: text.trim(),
        createdAt: Date.now(),
        plantVariant: Math.floor(Math.random() * TOTAL_PLANT_VARIANTS),
        gardenX: Math.round(5 + Math.random() * 85),
        gardenY: Math.round(Math.random() * 40),
      };
      setEntries((prev) => [...prev, entry]);
      return entry;
    },
    [today]
  );

  const streak = (() => {
    let count = 0;
    const dateSet = new Set(entries.map((e) => e.date));
    const d = new Date();
    if (!dateSet.has(getToday())) {
      d.setDate(d.getDate() - 1);
    }
    while (dateSet.has(d.toISOString().split("T")[0])) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  })();

  return { entries, addEntry, hasEntryToday, todayEntry, streak, today };
}
