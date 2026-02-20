import { useEffect, useRef } from "react";
import type { GamePhase } from "../types";

interface CrashCanvasProps {
  multiplier: number;
  crashed: boolean;
  phase: GamePhase;
}

export function CrashCanvas({ multiplier, crashed, phase }: CrashCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (phase === "waiting") {
      pointsRef.current = [];
    }
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const y = (H / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    if (phase === "flying" || phase === "crashed") {
      // Add point
      const progress = Math.min((multiplier - 1) / 20, 1);
      const x = W * 0.05 + progress * W * 0.88;
      const y = H * 0.9 - Math.pow(progress, 1.5) * H * 0.8;
      pointsRef.current.push({ x, y });

      if (pointsRef.current.length > 1) {
        // Fill area
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        if (crashed) {
          grad.addColorStop(0, "rgba(239,68,68,0.3)");
          grad.addColorStop(1, "rgba(239,68,68,0)");
        } else {
          grad.addColorStop(0, "rgba(16,185,129,0.3)");
          grad.addColorStop(1, "rgba(16,185,129,0)");
        }
        ctx.beginPath();
        ctx.moveTo(pointsRef.current[0].x, H * 0.9);
        pointsRef.current.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.lineTo(pointsRef.current[pointsRef.current.length - 1].x, H * 0.9);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Line
        ctx.beginPath();
        ctx.strokeStyle = crashed ? "#ef4444" : "#10b981";
        ctx.lineWidth = 3;
        ctx.shadowColor = crashed ? "#ef4444" : "#10b981";
        ctx.shadowBlur = 12;
        ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);
        pointsRef.current.forEach((p) => ctx.lineTo(p.x, p.y));
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Dot at end
        if (!crashed) {
          const last = pointsRef.current[pointsRef.current.length - 1];
          ctx.beginPath();
          ctx.arc(last.x, last.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = "#10b981";
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = 20;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }
  }, [multiplier, crashed, phase]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full h-full rounded-xl"
      style={{ background: "transparent" }}
    />
  );
}

