import { useState, useEffect, useCallback } from "react";

export interface GratitudeEntry {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  createdAt: number;
}

const STORAGE_KEY = "gratitude-garden-entries";

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function useGratitudeStore() {
  const [entries, setEntries] = useState<GratitudeEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
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
      };
      setEntries((prev) => [...prev, entry]);
      return entry;
    },
    [today]
  );

  const streak = (() => {
    let count = 0;
    const sorted = [...entries]
      .sort((a, b) => b.date.localeCompare(a.date));
    
    const dateSet = new Set(sorted.map((e) => e.date));
    const d = new Date();
    
    // If no entry today, start checking from yesterday
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
