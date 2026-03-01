import { GratitudeEntry } from "@/hooks/useGratitudeStore";
import { useMemo } from "react";

const PLANT_VARIANTS = [
  // Tulip
  (i: number) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.3}s` }}>
      <line x1="30" y1="80" x2="30" y2="35" stroke="hsl(var(--garden-leaf))" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 35 Q22 10, 30 8 Q38 10, 42 35 Q30 30, 18 35Z" fill="hsl(var(--garden-bloom))" />
      <ellipse cx="30" cy="18" rx="5" ry="4" fill="hsl(var(--garden-bloom-alt))" opacity="0.6" />
    </svg>
  ),
  // Daisy
  (i: number) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.4}s` }}>
      <line x1="30" y1="80" x2="30" y2="30" stroke="hsl(var(--garden-leaf))" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 55 Q10 45, 15 38" stroke="hsl(var(--garden-leaf))" strokeWidth="2" fill="none" />
      <ellipse cx="12" cy="36" rx="5" ry="8" fill="hsl(var(--garden-leaf-light))" transform="rotate(-30 12 36)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse key={angle} cx="30" cy="18" rx="3" ry="9" fill="hsl(var(--background))" transform={`rotate(${angle} 30 24)`} style={{ translate: "0 -6px" }} />
      ))}
      <circle cx="30" cy="24" r="5" fill="hsl(var(--garden-sun))" />
    </svg>
  ),
  // Simple sprout
  (i: number) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.2}s` }}>
      <line x1="30" y1="80" x2="30" y2="25" stroke="hsl(var(--garden-leaf))" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 40 Q15 30, 12 20 Q20 22, 30 35" fill="hsl(var(--garden-leaf-light))" />
      <path d="M30 30 Q45 20, 48 10 Q40 14, 30 25" fill="hsl(var(--garden-leaf))" />
      <circle cx="30" cy="20" r="6" fill="hsl(var(--garden-bloom-alt))" className="bloom-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
    </svg>
  ),
  // Rose
  (i: number) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.35}s` }}>
      <line x1="30" y1="80" x2="30" y2="32" stroke="hsl(var(--garden-leaf))" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 50 Q12 42, 14 34" stroke="hsl(var(--garden-leaf))" strokeWidth="2" fill="none" />
      <ellipse cx="12" cy="32" rx="5" ry="7" fill="hsl(var(--garden-leaf-light))" transform="rotate(-20 12 32)" />
      <circle cx="30" cy="24" r="10" fill="hsl(var(--garden-bloom))" />
      <circle cx="30" cy="24" r="6" fill="hsl(var(--garden-bloom))" opacity="0.7" />
      <circle cx="30" cy="24" r="3" fill="hsl(var(--garden-bloom-alt))" opacity="0.5" />
    </svg>
  ),
  // Seedling
  (i: number) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.25}s` }}>
      <line x1="30" y1="80" x2="30" y2="45" stroke="hsl(var(--garden-leaf))" strokeWidth="3" strokeLinecap="round" />
      <path d="M30 50 Q18 38, 16 28 Q24 32, 30 45" fill="hsl(var(--garden-leaf-light))" />
      <path d="M30 50 Q42 38, 44 28 Q36 32, 30 45" fill="hsl(var(--garden-leaf))" />
    </svg>
  ),
];

interface GardenProps {
  entries: GratitudeEntry[];
}

const Garden = ({ entries }: GardenProps) => {
  const plants = useMemo(() => {
    return entries.map((entry, i) => {
      const variant = PLANT_VARIANTS[i % PLANT_VARIANTS.length];
      return { entry, render: variant };
    });
  }, [entries]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-garden-sky p-6 pb-0 min-h-[280px]">
      {/* Sun */}
      <div className="absolute top-4 right-6 w-12 h-12 rounded-full bg-garden-sun opacity-80 bloom-pulse" />
      
      {/* Clouds */}
      <div className="absolute top-6 left-10 w-16 h-6 bg-card/60 rounded-full" />
      <div className="absolute top-4 left-20 w-10 h-5 bg-card/40 rounded-full" />

      {/* Garden area */}
      <div className="mt-auto pt-20">
        {entries.length === 0 ? (
          <div className="text-center pb-12">
            <p className="text-muted-foreground font-display text-lg italic">
              Your garden awaits its first seed…
            </p>
          </div>
        ) : (
          <div className="garden-grid pb-2">
            {plants.map(({ entry, render }, i) => (
              <div
                key={entry.id}
                className="plant-grow relative group cursor-pointer"
                style={{ 
                  transformOrigin: "bottom center",
                  animationDelay: `${i * 0.08}s`,
                  height: "80px",
                }}
                title={`${entry.date}: ${entry.text}`}
              >
                {render(i)}
                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-card rounded-lg shadow-lg text-xs max-w-[160px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-border">
                  <p className="font-display text-[10px] text-muted-foreground">{entry.date}</p>
                  <p className="truncate text-foreground">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Soil */}
        <div className="h-6 -mx-6 bg-garden-soil rounded-t-[40%]" />
      </div>
    </div>
  );
};

export default Garden;
