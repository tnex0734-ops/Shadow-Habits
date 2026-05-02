import { useTheme } from "@/contexts/ThemeContext";

interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const particles: Particle[] = Array.from({ length: 12 }, (_, i) => ({
  x: (i * 8.3 + 5) % 100,
  y: (i * 13.7 + 10) % 100,
  size: 2 + (i % 4),
  duration: 3 + (i % 5),
  delay: (i * 0.7) % 4,
}));

export function ParticleBackground() {
  const { charColor, charGlow } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: charColor,
            boxShadow: `0 0 ${p.size * 4}px ${charGlow}`,
            "--duration": `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, ${charGlow} 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, ${charGlow.replace("0.4", "0.15")} 0%, transparent 50%)`,
        }}
      />
    </div>
  );
}
