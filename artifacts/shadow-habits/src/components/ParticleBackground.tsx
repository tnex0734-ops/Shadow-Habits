import { useTheme } from "@/contexts/ThemeContext";

const particles = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 7.3 + 4) % 100,
  y: (i * 11.9 + 6) % 100,
  size: 1.5 + (i % 3) * 0.9,
  duration: 4 + (i % 7),
  delay: (i * 0.55) % 5,
  pulse: i % 5 === 0,
}));

export function ParticleBackground() {
  const { charColor, charGlow, charGlowSoft } = useTheme();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">

      {/* Cursed Domain — large background ring (Gojo's Infinite Void) */}
      <div
        className="absolute rounded-full domain-pulse"
        style={{
          width: "80vmax",
          height: "80vmax",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          border: `1px solid ${charColor}18`,
          boxShadow: `0 0 80px ${charGlowSoft} inset`,
        }}
      />
      {/* Inner ring — Malevolent Shrine boundary */}
      <div
        className="absolute rounded-full"
        style={{
          width: "50vmax",
          height: "50vmax",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          border: `1px solid ${charColor}0d`,
        }}
      />

      {/* Atmospheric depth glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 65% 55% at 20% 70%, ${charGlowSoft} 0%, transparent 65%),
            radial-gradient(ellipse 45% 40% at 80% 20%, ${charGlowSoft.replace("0.12", "0.06")} 0%, transparent 60%),
            radial-gradient(ellipse 35% 30% at 55% 95%, ${charGlowSoft.replace("0.12", "0.04")} 0%, transparent 55%)
          `,
        }}
      />

      {/* Cursed energy particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className={p.pulse ? "absolute rounded-full pulse-dot" : "absolute rounded-full particle"}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: charColor,
            boxShadow: `0 0 ${p.size * 5}px ${charGlow}, 0 0 ${p.size * 12}px ${charGlowSoft}`,
            "--duration": `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* SVG Cursed Energy lines — top-left corner bracket */}
      <svg className="absolute top-0 left-0 w-52 h-52 opacity-15" viewBox="0 0 220 220" fill="none">
        <line x1="0" y1="50" x2="170" y2="50" stroke={charColor} strokeWidth="0.6" strokeDasharray="4 8" />
        <line x1="50" y1="0" x2="50" y2="170" stroke={charColor} strokeWidth="0.6" strokeDasharray="4 8" />
        <rect x="44" y="44" width="12" height="12" stroke={charColor} strokeWidth="1" fill="none" />
        <line x1="50" y1="0" x2="50" y2="30" stroke={charColor} strokeWidth="1.5" />
        <line x1="0" y1="50" x2="30" y2="50" stroke={charColor} strokeWidth="1.5" />
      </svg>

      {/* SVG — bottom-right corner bracket */}
      <svg className="absolute bottom-0 right-0 w-52 h-52 opacity-15" viewBox="0 0 220 220" fill="none">
        <line x1="220" y1="170" x2="50" y2="170" stroke={charColor} strokeWidth="0.6" strokeDasharray="4 8" />
        <line x1="170" y1="220" x2="170" y2="50" stroke={charColor} strokeWidth="0.6" strokeDasharray="4 8" />
        <rect x="164" y="164" width="12" height="12" stroke={charColor} strokeWidth="1" fill="none" />
        <line x1="170" y1="220" x2="170" y2="190" stroke={charColor} strokeWidth="1.5" />
        <line x1="220" y1="170" x2="190" y2="170" stroke={charColor} strokeWidth="1.5" />
      </svg>

      {/* Expanding domain rings — animate outward slowly */}
      {[0, 1.2, 2.4].map((delay, i) => (
        <div
          key={i}
          className="domain-ring"
          style={{
            width: "60vmax",
            height: "60vmax",
            left: "50%",
            top: "50%",
            marginLeft: "-30vmax",
            marginTop: "-30vmax",
            borderColor: `${charColor}12`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
}
