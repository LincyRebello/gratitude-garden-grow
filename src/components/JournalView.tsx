import { GratitudeEntry } from "@/hooks/useGratitudeStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PLANT_VARIANTS, BLOOM_COLORS, LEAF_COLORS } from "@/components/Garden";

interface JournalViewProps {
  entries: GratitudeEntry[];
}

const JournalView = ({ entries }: JournalViewProps) => {
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt);

  if (sorted.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <p className="text-muted-foreground font-display text-lg italic">No entries yet. Plant your first seed!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3 pr-3">
        {sorted.map((entry, i) => {
          const variantIdx = entry.plantVariant % PLANT_VARIANTS.length;
          const bloomColor = BLOOM_COLORS[entry.plantVariant % BLOOM_COLORS.length];
          const leafColor = LEAF_COLORS[i % LEAF_COLORS.length];

          return (
            <div key={entry.id} className="bg-card rounded-xl border border-border p-4 flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-10 h-12 flex-shrink-0">
                {PLANT_VARIANTS[variantIdx](i, bloomColor, leafColor, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground font-display">{entry.date}</p>
                <p className="text-sm text-foreground mt-0.5">{entry.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default JournalView;
