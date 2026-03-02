import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const REMINDER_KEY = "gratitude-garden-reminder";

interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

function loadSettings(): ReminderSettings {
  try {
    const stored = localStorage.getItem(REMINDER_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { enabled: false, hour: 9, minute: 0 };
}

const DailyReminder = () => {
  const [settings, setSettings] = useState<ReminderSettings>(loadSettings);
  const [permissionState, setPermissionState] = useState<NotificationPermission | "unsupported">("default");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) {
      setPermissionState("unsupported");
    } else {
      setPermissionState(Notification.permission);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(REMINDER_KEY, JSON.stringify(settings));
  }, [settings]);

  // Schedule check every minute
  useEffect(() => {
    if (!settings.enabled || permissionState !== "granted") return;

    const check = () => {
      const now = new Date();
      if (now.getHours() === settings.hour && now.getMinutes() === settings.minute) {
        new Notification("Gratitude Garden 🌱", {
          body: "Time to plant today's seed of gratitude!",
          icon: "/favicon.ico",
        });
      }
    };

    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, [settings, permissionState]);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Notifications not supported",
        description: "Your browser doesn't support push notifications. Try a different browser!",
      });
      return false;
    }
    const perm = await Notification.requestPermission();
    setPermissionState(perm);
    if (perm !== "granted") {
      toast({
        title: "Permission needed",
        description: "Please allow notifications to use daily reminders.",
      });
      return false;
    }
    return true;
  }, []);

  const handleToggle = async () => {
    if (settings.enabled) {
      setSettings((s) => ({ ...s, enabled: false }));
      toast({ title: "Reminder turned off 🔕" });
    } else {
      const allowed = await requestPermission();
      if (allowed) {
        setSettings((s) => ({ ...s, enabled: true }));
        setShowPicker(true);
        toast({ title: "Reminder set! 🔔", description: `We'll nudge you at ${formatTime(settings.hour, settings.minute)}` });
      }
    }
  };

  const formatTime = (h: number, m: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    return `${displayH}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  if (permissionState === "unsupported") {
    return null; // Hide entirely if unsupported
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <span className="text-sm font-display text-foreground">Daily Reminder</span>
        </div>
        <Button
          variant={settings.enabled ? "default" : "outline"}
          size="sm"
          onClick={handleToggle}
          className="font-display gap-1.5 text-xs"
        >
          {settings.enabled ? (
            <>
              <BellOff className="h-3.5 w-3.5" />
              Turn Off
            </>
          ) : (
            <>
              <Bell className="h-3.5 w-3.5" />
              Enable
            </>
          )}
        </Button>
      </div>

      {settings.enabled && (
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <label className="text-xs text-muted-foreground">Remind me at:</label>
          <input
            type="time"
            value={`${settings.hour.toString().padStart(2, "0")}:${settings.minute.toString().padStart(2, "0")}`}
            onChange={(e) => {
              const [h, m] = e.target.value.split(":").map(Number);
              setSettings((s) => ({ ...s, hour: h, minute: m }));
              toast({ title: `Reminder updated to ${formatTime(h, m)} 🔔` });
            }}
            className="text-sm bg-background border border-border rounded-md px-2 py-1 text-foreground"
          />
        </div>
      )}
    </div>
  );
};

export default DailyReminder;
