import { useRef, useState } from "react";
import Garden from "@/components/Garden";
import GratitudeForm from "@/components/GratitudeForm";
import JournalView from "@/components/JournalView";
import StatsBar from "@/components/StatsBar";
import StatsDashboard from "@/components/StatsDashboard";
import ShareGarden from "@/components/ShareGarden";
import DailyReminder from "@/components/DailyReminder";
import StreakCelebration from "@/components/StreakCelebration";
import { useGratitudeStore } from "@/hooks/useGratitudeStore";
import { Leaf, BookOpen, Flower2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

type View = "garden" | "journal" | "stats";

const Index = () => {
  const { entries, addEntry, hasEntryToday, todayEntry, streak } = useGratitudeStore();
  const [view, setView] = useState<View>("garden");
  const gardenRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-xl px-4 py-10 space-y-8">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <h1 className="font-display text-3xl font-semibold text-foreground tracking-tight">
              Gratitude Garden
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Plant one seed of gratitude each day and watch your garden grow.
          </p>
        </header>

        {/* Stats */}
        <StatsBar totalEntries={entries.length} streak={streak} />

        {/* View toggles */}
        <div className="flex justify-center gap-2">
          <Button
            variant={view === "garden" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("garden")}
            className="font-display gap-2"
          >
            <Flower2 className="h-4 w-4" />
            Garden
          </Button>
          <Button
            variant={view === "journal" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("journal")}
            className="font-display gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Journal
          </Button>
          <Button
            variant={view === "stats" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("stats")}
            className="font-display gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Stats
          </Button>
        </div>

        {/* Views */}
        {view === "garden" && (
          <div className="space-y-4">
            <div ref={gardenRef}>
              <Garden entries={entries} />
            </div>
            <ShareGarden gardenRef={gardenRef} totalPlants={entries.length} streak={streak} />
          </div>
        )}
        {view === "journal" && <JournalView entries={entries} />}
        {view === "stats" && <StatsDashboard entries={entries} streak={streak} />}

        {/* Form */}
        <GratitudeForm
          onSubmit={addEntry}
          hasEntryToday={hasEntryToday}
          todayText={todayEntry?.text}
        />

        {/* Daily Reminder */}
        <DailyReminder />

        {/* Streak Celebration */}
        <StreakCelebration streak={streak} />
      </div>
    </div>
  );
};

export default Index;
