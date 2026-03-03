import { useEffect, useState, useCallback, useRef } from "react";

// --- Butterfly ---
function ButterflySprite({ color, style }: { color: string; style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 30 20" width="24" height="16" style={style} className="absolute pointer-events-none">
      <g className="butterfly-fly">
        <ellipse cx="15" cy="10" rx="2" ry="5" fill="hsl(25, 30%, 25%)" />
        <ellipse cx="9" cy="8" rx="6" ry="5" fill={color} opacity="0.8" className="wing-left" />
        <ellipse cx="21" cy="8" rx="6" ry="5" fill={color} opacity="0.8" className="wing-right" />
        <ellipse cx="9" cy="13" rx="4" ry="3.5" fill={color} opacity="0.6" className="wing-left" />
        <ellipse cx="21" cy="13" rx="4" ry="3.5" fill={color} opacity="0.6" className="wing-right" />
      </g>
    </svg>
  );
}

// --- Bee ---
function BeeSprite({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 20 16" width="16" height="12" style={style} className="absolute pointer-events-none bee-bob">
      <ellipse cx="10" cy="10" rx="5" ry="4" fill="hsl(45, 90%, 55%)" />
      <rect x="7" y="8" width="6" height="1.2" fill="hsl(25, 30%, 15%)" rx="0.5" />
      <rect x="7" y="10.5" width="6" height="1.2" fill="hsl(25, 30%, 15%)" rx="0.5" />
      <ellipse cx="7" cy="7" rx="3" ry="2" fill="hsl(200, 20%, 90%)" opacity="0.6" className="wing-left" />
      <ellipse cx="13" cy="7" rx="3" ry="2" fill="hsl(200, 20%, 90%)" opacity="0.6" className="wing-right" />
    </svg>
  );
}

// --- Bird ---
function BirdSprite({ style }: { style: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 30 12" width="22" height="9" style={style} className="absolute pointer-events-none">
      <path d="M2 6 Q8 2, 14 5 Q20 2, 28 6" stroke="hsl(25, 20%, 30%)" strokeWidth="1.5" fill="none" opacity="0.7" />
    </svg>
  );
}

const BUTTERFLY_COLORS = [
  "hsl(340, 50%, 65%)",
  "hsl(200, 50%, 60%)",
  "hsl(45, 70%, 60%)",
  "hsl(280, 40%, 60%)",
  "hsl(160, 45%, 50%)",
];

interface Creature {
  id: number;
  type: "butterfly" | "bee" | "bird";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  duration: number;
}

let creatureId = 0;

const GardenCreatures = () => {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const interactingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const spawnCreature = useCallback(() => {
    if (interactingRef.current) return;

    const types: Creature["type"][] = ["butterfly", "bee", "bird"];
    const type = types[Math.floor(Math.random() * types.length)];
    const id = creatureId++;

    let creature: Creature;

    if (type === "bird") {
      const y = 5 + Math.random() * 25;
      creature = {
        id, type,
        startX: 105, startY: y,
        endX: -10, endY: y + (Math.random() - 0.5) * 10,
        color: "",
        duration: 8 + Math.random() * 6,
      };
    } else if (type === "bee") {
      creature = {
        id, type,
        startX: Math.random() * 80 + 10,
        startY: 50 + Math.random() * 30,
        endX: Math.random() * 80 + 10,
        endY: 50 + Math.random() * 30,
        color: "",
        duration: 6 + Math.random() * 4,
      };
    } else {
      const fromLeft = Math.random() > 0.5;
      creature = {
        id, type,
        startX: fromLeft ? -5 : 105,
        startY: 20 + Math.random() * 40,
        endX: fromLeft ? 105 : -5,
        endY: 20 + Math.random() * 40,
        color: BUTTERFLY_COLORS[Math.floor(Math.random() * BUTTERFLY_COLORS.length)],
        duration: 10 + Math.random() * 8,
      };
    }

    setCreatures((prev) => [...prev, creature]);

    // Remove after animation completes
    setTimeout(() => {
      setCreatures((prev) => prev.filter((c) => c.id !== id));
    }, creature.duration * 1000);
  }, []);

  useEffect(() => {
    function scheduleNext() {
      const delay = 20000 + Math.random() * 20000; // 20-40s
      timerRef.current = setTimeout(() => {
        spawnCreature();
        scheduleNext();
      }, delay);
    }

    // Spawn first one after a short delay
    timerRef.current = setTimeout(() => {
      spawnCreature();
      scheduleNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [spawnCreature]);

  // Pause on user interaction
  useEffect(() => {
    const pause = () => { interactingRef.current = true; };
    const resume = () => { interactingRef.current = false; };

    window.addEventListener("pointerdown", pause);
    window.addEventListener("pointerup", resume);
    window.addEventListener("keydown", pause);
    window.addEventListener("keyup", resume);

    return () => {
      window.removeEventListener("pointerdown", pause);
      window.removeEventListener("pointerup", resume);
      window.removeEventListener("keydown", pause);
      window.removeEventListener("keyup", resume);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
      {creatures.map((c) => {
        const animStyle: React.CSSProperties = {
          left: `${c.startX}%`,
          top: `${c.startY}%`,
          animation: `creatureMove ${c.duration}s linear forwards`,
          // CSS custom props for the animation endpoint
          ["--end-x" as string]: `${c.endX - c.startX}%`,
          ["--end-y" as string]: `${c.endY - c.startY}%`,
        };

        if (c.type === "butterfly") {
          return <ButterflySprite key={c.id} color={c.color} style={animStyle} />;
        }
        if (c.type === "bee") {
          return <BeeSprite key={c.id} style={animStyle} />;
        }
        return <BirdSprite key={c.id} style={animStyle} />;
      })}
    </div>
  );
};

export default GardenCreatures;
