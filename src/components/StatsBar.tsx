import { Flame, TreeDeciduous, Flower2 } from "lucide-react";

interface StatsBarProps {
  totalEntries: number;
  streak: number;
}

const StatsBar = ({ totalEntries, streak }: StatsBarProps) => {
  return (
    <div className="flex gap-4 justify-center">
      <div className="flex items-center gap-2 bg-card rounded-xl border border-border px-4 py-2.5">
        <TreeDeciduous className="h-4 w-4 text-primary" />
        <span className="text-sm font-body">
          <span className="font-bold text-foreground">{totalEntries}</span>{" "}
          <span className="text-muted-foreground">{totalEntries === 1 ? "plant" : "plants"}</span>
        </span>
      </div>
      <div className="flex items-center gap-2 bg-card rounded-xl border border-border px-4 py-2.5">
        <Flame className="h-4 w-4 text-accent" />
        <span className="text-sm font-body">
          <span className="font-bold text-foreground">{streak}</span>{" "}
          <span className="text-muted-foreground">day streak</span>
        </span>
      </div>
    </div>
  );
};

export default StatsBar;
