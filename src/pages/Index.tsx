import { useState } from "react";
import Garden from "@/components/Garden";
import GratitudeForm from "@/components/GratitudeForm";
import JournalView from "@/components/JournalView";
import StatsBar from "@/components/StatsBar";
import { useGratitudeStore } from "@/hooks/useGratitudeStore";
import { Leaf, BookOpen, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { entries, addEntry, hasEntryToday, todayEntry, streak } = useGratitudeStore();
  const [showJournal, setShowJournal] = useState(false);

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

        {/* Toggle */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowJournal(!showJournal)}
            className="font-display gap-2"
          >
            {showJournal ? <Flower2 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
            {showJournal ? "View Garden" : "View Journal"}
          </Button>
        </div>

        {/* Garden or Journal */}
        {showJournal ? <JournalView entries={entries} /> : <Garden entries={entries} />}

        {/* Form */}
        <GratitudeForm
          onSubmit={addEntry}
          hasEntryToday={hasEntryToday}
          todayText={todayEntry?.text}
        />
      </div>
    </div>
  );
};

export default Index;
