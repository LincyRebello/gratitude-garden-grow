import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";

interface GratitudeFormProps {
  onSubmit: (text: string) => void;
  hasEntryToday: boolean;
  todayText?: string;
}

const GratitudeForm = ({ onSubmit, hasEntryToday, todayText }: GratitudeFormProps) => {
  const [text, setText] = useState("");
  const [justPlanted, setJustPlanted] = useState(false);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
    setJustPlanted(true);
    setTimeout(() => setJustPlanted(false), 2000);
  };

  if (hasEntryToday) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 text-center space-y-3">
        {justPlanted ? (
          <div className="seed-drop">
            <Sprout className="mx-auto h-10 w-10 text-primary" />
            <p className="font-display text-lg text-foreground mt-2">A new seed has been planted!</p>
          </div>
        ) : (
          <>
            <Sprout className="mx-auto h-8 w-8 text-primary opacity-70" />
            <p className="font-display text-lg text-foreground">Today's gratitude is planted 🌱</p>
            <p className="text-muted-foreground text-sm italic">"{todayText}"</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <label className="block font-display text-lg text-foreground">
        What are you grateful for today?
      </label>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Today I'm grateful for..."
        className="min-h-[100px] resize-none bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
        maxLength={280}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{text.length}/280</span>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-display gap-2"
        >
          <Sprout className="h-4 w-4" />
          Plant a Seed
        </Button>
      </div>
    </div>
  );
};

export default GratitudeForm;
