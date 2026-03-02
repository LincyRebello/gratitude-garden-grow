import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";

interface ShareGardenProps {
  gardenRef: React.RefObject<HTMLDivElement>;
  totalPlants: number;
  streak: number;
}

const ShareGarden = ({ gardenRef, totalPlants, streak }: ShareGardenProps) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const captureGarden = async (): Promise<Blob | null> => {
    if (!gardenRef.current) return null;
    setIsCapturing(true);

    try {
      const canvas = await html2canvas(gardenRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Draw overlay
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const w = canvas.width;
      const h = canvas.height;

      // Stats badge (top-left)
      const badgeH = 48;
      const badgeW = 220;
      const badgeX = 24;
      const badgeY = 24;
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 16);
      ctx.fill();
      ctx.font = "bold 22px 'DM Sans', sans-serif";
      ctx.fillStyle = "#fff";
      ctx.fillText(`🌱 ${totalPlants} plants  🔥 ${streak} day streak`, badgeX + 14, badgeY + 32);

      // Watermark (bottom-right)
      const wmText = "Gratitude Garden 🌱 grow-your-thanks.lovable.app";
      ctx.font = "14px 'DM Sans', sans-serif";
      const wmMetrics = ctx.measureText(wmText);
      const wmX = w - wmMetrics.width - 24;
      const wmY = h - 18;
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.roundRect(wmX - 10, wmY - 18, wmMetrics.width + 20, 28, 10);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText(wmText, wmX, wmY);

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png", 1);
      });
    } catch {
      toast({ title: "Couldn't capture garden", description: "Please try again." });
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = async () => {
    const blob = await captureGarden();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-gratitude-garden.png";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Garden saved! 🌿", description: "Your garden image has been downloaded." });
  };

  const handleShare = async () => {
    const blob = await captureGarden();
    if (!blob) return;

    if (navigator.share && navigator.canShare) {
      const file = new File([blob], "my-gratitude-garden.png", { type: "image/png" });
      const shareData = { files: [file], title: "My Gratitude Garden", text: "Look at my gratitude garden! 🌱" };
      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return;
        } catch {
          // User cancelled or share failed, fall through to download
        }
      }
    }
    // Fallback to download
    handleDownload();
  };

  const supportsShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="flex gap-2 justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={isCapturing}
        className="font-display gap-2"
      >
        {isCapturing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Download
      </Button>
      {supportsShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          disabled={isCapturing}
          className="font-display gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      )}
    </div>
  );
};

export default ShareGarden;
