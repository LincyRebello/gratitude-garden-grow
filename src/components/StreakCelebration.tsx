import { useEffect, useState, useRef } from "react";

const MILESTONES = [7, 30, 100] as const;

const MESSAGES: Record<number, string> = {
  7: "7 days of gratitude! You're blooming 🌸",
  30: "30 days! Your garden is flourishing 🌻",
  100: "100 days! A true garden of gratitude 🌳",
};

const CELEBRATION_KEY = "gratitude-celebrated-milestones";

function getCelebrated(): number[] {
  try {
    return JSON.parse(localStorage.getItem(CELEBRATION_KEY) || "[]");
  } catch {
    return [];
  }
}

function markCelebrated(milestone: number) {
  const prev = getCelebrated();
  if (!prev.includes(milestone)) {
    localStorage.setItem(CELEBRATION_KEY, JSON.stringify([...prev, milestone]));
  }
}

// Garden-palette confetti colors
const CONFETTI_COLORS = [
  "hsl(142, 40%, 42%)",  // primary green
  "hsl(340, 60%, 65%)",  // pink bloom
  "hsl(45, 80%, 60%)",   // golden
  "hsl(35, 80%, 56%)",   // accent
  "hsl(200, 60%, 55%)",  // blue
  "hsl(280, 50%, 60%)",  // purple
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
}

function ConfettiCanvas({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1,
    }));

    let frame = 0;
    const maxFrames = 180;

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      const fadeStart = maxFrames * 0.6;
      for (const p of particles) {
        p.x += p.vx;
        p.vy += 0.05;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (frame > fadeStart) {
          p.opacity = Math.max(0, 1 - (frame - fadeStart) / (maxFrames - fadeStart));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      if (frame < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        onDone();
      }
    }
    requestAnimationFrame(animate);
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
    />
  );
}

interface StreakCelebrationProps {
  streak: number;
}

const StreakCelebration = ({ streak }: StreakCelebrationProps) => {
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const celebrated = getCelebrated();
    const hit = MILESTONES.find((m) => streak >= m && !celebrated.includes(m));
    if (hit) {
      setActiveMilestone(hit);
      setShowConfetti(true);
      markCelebrated(hit);
    }
  }, [streak]);

  if (!activeMilestone) return null;

  return (
    <>
      {showConfetti && <ConfettiCanvas onDone={() => setShowConfetti(false)} />}
      {activeMilestone && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center pointer-events-none animate-fade-in">
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-8 text-center shadow-xl pointer-events-auto max-w-sm mx-4 animate-scale-in">
            <div className="text-5xl mb-3">
              {activeMilestone === 7 ? "🌸" : activeMilestone === 30 ? "🌻" : "🌳"}
            </div>
            <h2 className="font-display text-xl text-foreground mb-2">
              Milestone Reached!
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              {MESSAGES[activeMilestone]}
            </p>
            <button
              onClick={() => setActiveMilestone(null)}
              className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-display text-sm hover:bg-primary/90 transition-colors"
            >
              Keep Growing 🌱
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StreakCelebration;
