import { useEffect, useRef } from "react";

export function ParticleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const spacing = 50;
    const maxDist = 120;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width / spacing) + 1;
      const rows = Math.ceil(canvas.height / spacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let radius = 1;
          let alpha = 0.15;

          if (dist < maxDist) {
            const factor = 1 - dist / maxDist;
            radius = 1 + factor * 3;
            alpha = 0.15 + factor * 0.6;
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(120, 220, 232, ${alpha})`;
          ctx.fill();

          // Draw connecting lines to nearby dots when mouse is near
          if (dist < maxDist) {
            // Connect to right neighbor
            if (i < cols - 1) {
              const nx = (i + 1) * spacing;
              const ny = j * spacing;
              const ndist = Math.sqrt((mouse.x - nx) ** 2 + (mouse.y - ny) ** 2);
              if (ndist < maxDist) {
                const lineAlpha = Math.min(alpha, 0.15 + (1 - ndist / maxDist) * 0.3) * 0.4;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nx, ny);
                ctx.strokeStyle = `rgba(120, 220, 232, ${lineAlpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
            // Connect to bottom neighbor
            if (j < rows - 1) {
              const nx = i * spacing;
              const ny = (j + 1) * spacing;
              const ndist = Math.sqrt((mouse.x - nx) ** 2 + (mouse.y - ny) ** 2);
              if (ndist < maxDist) {
                const lineAlpha = Math.min(alpha, 0.15 + (1 - ndist / maxDist) * 0.3) * 0.4;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(nx, ny);
                ctx.strokeStyle = `rgba(120, 220, 232, ${lineAlpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-40"
      style={{ pointerEvents: "none" }}
    />
  );
}
