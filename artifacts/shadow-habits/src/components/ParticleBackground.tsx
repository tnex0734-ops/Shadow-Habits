import { useTheme } from "@/contexts/ThemeContext";

interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: "dot" | "pulse";
}

const particles: Particle[] = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 7.1 + 3) % 100,
  y: (i * 11.3 + 8) % 100,
  size: 1.5 + (i % 4) * 0.8,
  duration: 4 + (i % 6),
  delay: (i * 0.6) % 5,
  type: i % 4 === 0 ? "pulse" : "dot",
}));

export function ParticleBackground() {
  const { charColor, charGlow, charGlowSoft } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep radial atmospheric glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 15% 60%, ${charGlowSoft} 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 85% 15%, ${charGlowSoft.replace("0.15", "0.08")} 0%, transparent 60%),
            radial-gradient(ellipse 30% 30% at 50% 90%, ${charGlowSoft.replace("0.15", "0.05")} 0%, transparent 60%)
          `,
        }}
      />

      {/* Floating particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className={p.type === "pulse" ? "absolute rounded-full pulse-dot" : "absolute rounded-full particle"}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: charColor,
            boxShadow: `0 0 ${p.size * 5}px ${charGlow}, 0 0 ${p.size * 10}px ${charGlowSoft}`,
            "--duration": `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* Corner accent lines — top left */}
      <svg
        className="absolute top-0 left-0 w-48 h-48 opacity-20"
        viewBox="0 0 200 200"
        fill="none"
      >
        <line x1="0" y1="40" x2="160" y2="40" stroke={charColor} strokeWidth="0.5" />
        <line x1="40" y1="0" x2="40" y2="160" stroke={charColor} strokeWidth="0.5" />
        <circle cx="40" cy="40" r="4" fill={charColor} />
      </svg>

      {/* Corner accent lines — bottom right */}
      <svg
        className="absolute bottom-0 right-0 w-48 h-48 opacity-20"
        viewBox="0 0 200 200"
        fill="none"
      >
        <line x1="200" y1="160" x2="40" y2="160" stroke={charColor} strokeWidth="0.5" />
        <line x1="160" y1="200" x2="160" y2="40" stroke={charColor} strokeWidth="0.5" />
        <circle cx="160" cy="160" r="4" fill={charColor} />
      </svg>
    </div>
  );
}
