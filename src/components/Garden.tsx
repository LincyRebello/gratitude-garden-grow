import { GratitudeEntry } from "@/hooks/useGratitudeStore";
import { useMemo, useState } from "react";

// Color palettes for variety - each plant gets a unique combination
const BLOOM_COLORS = [
  "hsl(340, 60%, 65%)", // pink
  "hsl(280, 50%, 60%)", // purple
  "hsl(20, 80%, 60%)",  // coral
  "hsl(45, 80%, 60%)",  // golden
  "hsl(200, 60%, 55%)", // blue
  "hsl(160, 50%, 50%)", // teal
  "hsl(0, 70%, 62%)",   // red
  "hsl(50, 90%, 65%)",  // yellow
  "hsl(310, 45%, 55%)", // magenta
  "hsl(15, 75%, 55%)",  // burnt orange
];

const LEAF_COLORS = [
  "hsl(142, 50%, 40%)",
  "hsl(130, 45%, 45%)",
  "hsl(155, 40%, 38%)",
  "hsl(120, 35%, 42%)",
  "hsl(145, 55%, 35%)",
];

type PlantRenderer = (i: number, bloomColor: string, leafColor: string, size: number) => JSX.Element;

const PLANT_VARIANTS: PlantRenderer[] = [
  // Tulip
  (i, bloom, leaf, size) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.3}s` }}>
      <line x1="30" y1="80" x2="30" y2="35" stroke={leaf} strokeWidth="3" strokeLinecap="round" />
      <path d="M18 35 Q22 10, 30 8 Q38 10, 42 35 Q30 30, 18 35Z" fill={bloom} />
      <ellipse cx="30" cy="18" rx="5" ry="4" fill={bloom} opacity="0.5" />
    </svg>
  ),
  // Daisy
  (i, bloom, leaf, size) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.4}s` }}>
      <line x1="30" y1="80" x2="30" y2="30" stroke={leaf} strokeWidth="3" strokeLinecap="round" />
      <path d="M20 55 Q10 45, 15 38" stroke={leaf} strokeWidth="2" fill="none" />
      <ellipse cx="12" cy="36" rx="5" ry="8" fill={leaf} opacity="0.6" transform="rotate(-30 12 36)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse key={angle} cx="30" cy="18" rx="3" ry="9" fill={bloom} opacity="0.8" transform={`rotate(${angle} 30 24)`} style={{ translate: "0 -6px" }} />
      ))}
      <circle cx="30" cy="24" r="5" fill="hsl(42, 90%, 62%)" />
    </svg>
  ),
  // Sprout with berry
  (i, bloom, leaf, size) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.2}s` }}>
      <line x1="30" y1="80" x2="30" y2="25" stroke={leaf} strokeWidth="3" strokeLinecap="round" />
      <path d="M30 40 Q15 30, 12 20 Q20 22, 30 35" fill={leaf} opacity="0.7" />
      <path d="M30 30 Q45 20, 48 10 Q40 14, 30 25" fill={leaf} />
      <circle cx="30" cy="20" r="6" fill={bloom} className="bloom-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
    </svg>
  ),
  // Rose
  (i, bloom, leaf, size) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.35}s` }}>
      <line x1="30" y1="80" x2="30" y2="32" stroke={leaf} strokeWidth="3" strokeLinecap="round" />
      <path d="M22 50 Q12 42, 14 34" stroke={leaf} strokeWidth="2" fill="none" />
      <ellipse cx="12" cy="32" rx="5" ry="7" fill={leaf} opacity="0.6" transform="rotate(-20 12 32)" />
      <circle cx="30" cy="24" r="10" fill={bloom} />
      <circle cx="30" cy="24" r="6" fill={bloom} opacity="0.7" />
      <circle cx="30" cy="24" r="3" fill={bloom} opacity="0.4" />
    </svg>
  ),
  // Seedling
  (i, bloom, leaf, size) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.25}s` }}>
      <line x1="30" y1="80" x2="30" y2="45" stroke={leaf} strokeWidth="3" strokeLinecap="round" />
      <path d="M30 50 Q18 38, 16 28 Q24 32, 30 45" fill={leaf} opacity="0.7" />
      <path d="M30 50 Q42 38, 44 28 Q36 32, 30 45" fill={leaf} />
    </svg>
  ),
  // Sunflower
  (i, bloom, leaf, size) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.3}s` }}>
      <line x1="30" y1="80" x2="30" y2="28" stroke={leaf} strokeWidth="4" strokeLinecap="round" />
      <path d="M24 55 Q14 48, 10 40" stroke={leaf} strokeWidth="2" fill="none" />
      <ellipse cx="8" cy="38" rx="6" ry="9" fill={leaf} opacity="0.6" transform="rotate(-25 8 38)" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <ellipse key={angle} cx="30" cy="14" rx="3" ry="8" fill={bloom} transform={`rotate(${angle} 30 22)`} style={{ translate: "0 -8px" }} />
      ))}
      <circle cx="30" cy="22" r="7" fill="hsl(30, 50%, 30%)" />
    </svg>
  ),
  // Lavender
  (i, bloom, leaf, size) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.2}s` }}>
      <line x1="30" y1="80" x2="30" y2="20" stroke={leaf} strokeWidth="2" strokeLinecap="round" />
      {[0, 4, 8, 12, 16, 20].map((y) => (
        <ellipse key={y} cx="30" cy={18 + y} rx={3 + y * 0.15} ry="3" fill={bloom} opacity={0.6 + y * 0.02} />
      ))}
    </svg>
  ),
  // Bell flower
  (i, bloom, leaf, size) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.4}s` }}>
      <line x1="30" y1="80" x2="30" y2="30" stroke={leaf} strokeWidth="3" strokeLinecap="round" />
      <path d="M30 45 Q20 40, 18 32" stroke={leaf} strokeWidth="2" fill="none" />
      <path d="M18 34 Q14 26, 18 20 Q22 14, 26 18 Q20 24, 18 34Z" fill={bloom} opacity="0.85" />
      <path d="M30 35 Q40 30, 42 22" stroke={leaf} strokeWidth="2" fill="none" />
      <path d="M42 24 Q38 16, 42 10 Q46 4, 50 8 Q44 14, 42 24Z" fill={bloom} opacity="0.7" />
      <path d="M30 30 Q28 22, 30 14 Q32 8, 36 12 Q32 18, 30 30Z" fill={bloom} />
    </svg>
  ),
  // Mushroom
  (i, bloom, leaf, size) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.15}s` }}>
      <rect x="26" y="45" width="8" height="35" rx="3" fill="hsl(40, 30%, 85%)" />
      <ellipse cx="30" cy="45" rx="18" ry="14" fill={bloom} />
      <circle cx="24" cy="40" r="3" fill="hsl(0, 0%, 100%)" opacity="0.5" />
      <circle cx="35" cy="38" r="2" fill="hsl(0, 0%, 100%)" opacity="0.4" />
      <circle cx="28" cy="48" r="2.5" fill="hsl(0, 0%, 100%)" opacity="0.3" />
    </svg>
  ),
  // Cactus flower
  (i, bloom, leaf, size) => (
    <svg key={i} viewBox="0 0 60 80" className="w-full h-full sway" style={{ animationDelay: `${i * 0.3}s` }}>
      <rect x="24" y="30" width="12" height="50" rx="6" fill={leaf} />
      <rect x="8" y="45" width="16" height="8" rx="4" fill={leaf} opacity="0.8" />
      <rect x="36" y="38" width="16" height="8" rx="4" fill={leaf} opacity="0.8" />
      <circle cx="30" cy="28" r="5" fill={bloom} className="bloom-pulse" style={{ animationDelay: `${i * 0.4}s` }} />
      <circle cx="14" cy="43" r="3" fill={bloom} opacity="0.7" />
    </svg>
  ),
];

function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

const SKY_STYLES: Record<string, { bg: string; extra: JSX.Element }> = {
  morning: {
    bg: "linear-gradient(180deg, hsl(20, 70%, 85%) 0%, hsl(35, 80%, 88%) 50%, hsl(45, 60%, 92%) 100%)",
    extra: (
      <div className="absolute top-6 right-8 w-14 h-14 rounded-full opacity-70" style={{ background: "radial-gradient(circle, hsl(42, 90%, 75%), hsl(20, 80%, 70%))" }} />
    ),
  },
  afternoon: {
    bg: "linear-gradient(180deg, hsl(200, 50%, 82%) 0%, hsl(200, 40%, 88%) 60%, hsl(45, 50%, 92%) 100%)",
    extra: (
      <>
        <div className="absolute top-4 right-6 w-12 h-12 rounded-full bloom-pulse" style={{ background: "hsl(42, 90%, 62%)" }} />
        <div className="absolute top-6 left-10 w-16 h-6 bg-card/50 rounded-full" />
        <div className="absolute top-4 left-24 w-10 h-5 bg-card/30 rounded-full" />
      </>
    ),
  },
  evening: {
    bg: "linear-gradient(180deg, hsl(260, 30%, 40%) 0%, hsl(20, 70%, 55%) 40%, hsl(35, 80%, 65%) 100%)",
    extra: (
      <div className="absolute top-5 right-10 w-14 h-14 rounded-full opacity-60" style={{ background: "radial-gradient(circle, hsl(20, 90%, 70%), hsl(35, 80%, 55%))" }} />
    ),
  },
  night: {
    bg: "linear-gradient(180deg, hsl(230, 40%, 12%) 0%, hsl(220, 35%, 20%) 60%, hsl(230, 25%, 30%) 100%)",
    extra: (
      <>
        {/* Moon */}
        <div className="absolute top-4 right-8 w-10 h-10 rounded-full" style={{ background: "hsl(45, 20%, 85%)", boxShadow: "0 0 20px hsl(45, 30%, 70%)" }} />
        {/* Stars */}
        {[
          { x: "10%", y: "12%", s: 2 }, { x: "25%", y: "8%", s: 1.5 }, { x: "40%", y: "18%", s: 2 },
          { x: "55%", y: "6%", s: 1 }, { x: "70%", y: "14%", s: 2.5 }, { x: "15%", y: "25%", s: 1 },
          { x: "85%", y: "22%", s: 1.5 }, { x: "50%", y: "28%", s: 1 }, { x: "35%", y: "5%", s: 2 },
        ].map((star, idx) => (
          <div key={idx} className="absolute rounded-full bloom-pulse" style={{
            left: star.x, top: star.y, width: star.s, height: star.s,
            background: "hsl(45, 40%, 90%)", animationDelay: `${idx * 0.4}s`,
          }} />
        ))}
      </>
    ),
  },
};

interface GardenProps {
  entries: GratitudeEntry[];
}

const Garden = ({ entries }: GardenProps) => {
  const timeOfDay = getTimeOfDay();
  const sky = SKY_STYLES[timeOfDay];

  const plants = useMemo(() => {
    return entries.map((entry, i) => {
      const variantIdx = entry.plantVariant % PLANT_VARIANTS.length;
      const bloomColor = BLOOM_COLORS[entry.plantVariant % BLOOM_COLORS.length];
      const leafColor = LEAF_COLORS[i % LEAF_COLORS.length];
      const size = 0.8 + (((entry.plantVariant * 7 + i * 3) % 5) / 10); // 0.8-1.2
      return { entry, variantIdx, bloomColor, leafColor, size };
    });
  }, [entries]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden p-6 pb-0 min-h-[280px]" style={{ background: sky.bg }}>
      {sky.extra}

      {/* Garden area */}
      <div className="relative mt-auto" style={{ minHeight: "200px" }}>
        {entries.length === 0 ? (
          <div className="text-center pt-16 pb-12">
            <p className="text-muted-foreground font-display text-lg italic drop-shadow-sm" style={{ color: timeOfDay === "night" ? "hsl(40, 20%, 70%)" : undefined }}>
              Your garden awaits its first seed…
            </p>
          </div>
        ) : (
          <div className="relative w-full" style={{ height: "180px" }}>
            {plants.map(({ entry, variantIdx, bloomColor, leafColor, size }, i) => (
              <div
                key={entry.id}
                className="plant-grow absolute group cursor-pointer"
                style={{
                  left: `${entry.gardenX}%`,
                  bottom: `${8 + entry.gardenY * 0.4}%`,
                  transformOrigin: "bottom center",
                  animationDelay: `${i * 0.08}s`,
                  width: `${50 * size}px`,
                  height: `${80 * size}px`,
                  transform: `translateX(-50%) scale(${size})`,
                  zIndex: Math.round(100 - entry.gardenY),
                }}
                title={`${entry.date}: ${entry.text}`}
              >
                {PLANT_VARIANTS[variantIdx](i, bloomColor, leafColor, size)}
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-card rounded-lg shadow-lg text-xs max-w-[160px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border border-border">
                  <p className="font-display text-[10px] text-muted-foreground">{entry.date}</p>
                  <p className="truncate text-foreground">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Soil */}
        <div className="h-6 -mx-6 rounded-t-[40%]" style={{ background: "hsl(25, 35%, 28%)" }} />
      </div>
    </div>
  );
};

export default Garden;

// Export plant renderers for journal view
export { PLANT_VARIANTS, BLOOM_COLORS, LEAF_COLORS };
