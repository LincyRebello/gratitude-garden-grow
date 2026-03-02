import { useMemo } from "react";
import { GratitudeEntry } from "@/hooks/useGratitudeStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame, TreeDeciduous, CalendarDays, Clock, TrendingUp, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface StatsDashboardProps {
  entries: GratitudeEntry[];
  streak: number;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

const StatsDashboard = ({ entries, streak }: StatsDashboardProps) => {
  const stats = useMemo(() => {
    const dateSet = new Set(entries.map((e) => e.date));

    // Longest streak
    const sortedDates = [...dateSet].sort();
    let longest = 0;
    let current = 0;
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) { current = 1; }
      else {
        const prev = new Date(sortedDates[i - 1]);
        const curr = new Date(sortedDates[i]);
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        current = diff === 1 ? current + 1 : 1;
      }
      longest = Math.max(longest, current);
    }

    // Most active time
    const hourCounts: Record<number, number> = {};
    entries.forEach((e) => {
      const hour = new Date(e.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    let peakHour = 0;
    let peakCount = 0;
    Object.entries(hourCounts).forEach(([h, c]) => {
      if (c > peakCount) { peakHour = Number(h); peakCount = c; }
    });
    const peakLabel = peakHour < 12 ? `${peakHour || 12} AM` : `${peakHour === 12 ? 12 : peakHour - 12} PM`;

    // Growth timeline (cumulative)
    const growthData = entries
      .sort((a, b) => a.createdAt - b.createdAt)
      .map((_, i) => ({
        day: i + 1,
        plants: i + 1,
      }));

    // Heatmap data (last 90 days)
    const today = new Date();
    const heatmapDays: { date: string; has: boolean }[] = [];
    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split("T")[0];
      heatmapDays.push({ date: ds, has: dateSet.has(ds) });
    }

    // Day of week distribution
    const dayCounts: Record<number, number> = {};
    entries.forEach((e) => {
      const day = new Date(e.date).getDay();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let bestDay = 0;
    let bestDayCount = 0;
    Object.entries(dayCounts).forEach(([d, c]) => {
      if (c > bestDayCount) { bestDay = Number(d); bestDayCount = c; }
    });
    const insight = entries.length > 0
      ? `You're most grateful on ${dayNames[bestDay]}s 🌿`
      : "Start planting to see your insights! 🌱";

    return { longest, peakLabel, growthData, heatmapDays, insight };
  }, [entries]);

  return (
    <ScrollArea className="h-[520px]">
      <div className="space-y-4 pr-3">
        {/* Streak & totals */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="h-5 w-5 mx-auto text-accent mb-1" />
              <p className="text-2xl font-bold font-display text-foreground">{streak}</p>
              <p className="text-xs text-muted-foreground">Current streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold font-display text-foreground">{stats.longest}</p>
              <p className="text-xs text-muted-foreground">Longest streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <TreeDeciduous className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-2xl font-bold font-display text-foreground">{entries.length}</p>
              <p className="text-xs text-muted-foreground">Total plants</p>
            </CardContent>
          </Card>
        </div>

        {/* Consistency heatmap */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Last 90 Days
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="grid grid-cols-[repeat(18,1fr)] gap-[3px]">
              {stats.heatmapDays.map((d) => (
                <div
                  key={d.date}
                  className="aspect-square rounded-sm"
                  style={{
                    backgroundColor: d.has
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
                    opacity: d.has ? 1 : 0.4,
                  }}
                  title={`${d.date}${d.has ? " ✓" : ""}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Growth timeline */}
        {stats.growthData.length > 1 && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Growth Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.growthData}>
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="plants"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Most active time + insight */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-5 w-5 mx-auto text-accent mb-1" />
              <p className="text-lg font-bold font-display text-foreground">{stats.peakLabel}</p>
              <p className="text-xs text-muted-foreground">Most active time</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Sparkles className="h-5 w-5 mx-auto text-accent mb-1" />
              <p className="text-sm font-display text-foreground mt-1">{stats.insight}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};

export default StatsDashboard;
