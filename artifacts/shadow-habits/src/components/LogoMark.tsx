interface LogoMarkProps {
  charColor: string;
  variant?: "full" | "sidebar";
  className?: string;
}

function SorcererFace({ color, bg = "rgba(3,9,18,0.97)" }: { color: string; bg?: string }) {
  return (
    <svg viewBox="0 0 90 94" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">

      {/* ── Cursed energy particles ── */}
      <circle cx="10" cy="44" r="2.2" fill={color} opacity="0.7"/>
      <circle cx="80" cy="40" r="1.6" fill={color} opacity="0.6"/>
      <circle cx="6"  cy="66" r="1.4" fill={color} opacity="0.45"/>
      <circle cx="84" cy="68" r="1.8" fill={color} opacity="0.5"/>
      <path d="M2 54 L9 54"  stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M81 54 L88 54" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M4 36 L7 40 L4 44"  stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4"/>
      <path d="M86 36 L83 40 L86 44" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4"/>

      {/* ── Spiky hair ── */}
      {/* Far-left angled spike */}
      <path d="M20 36 L14 14 L30 32" fill="white"/>
      {/* Left spike */}
      <path d="M30 30 L34 6 L40 28" fill="white"/>
      {/* Center spike — tallest */}
      <path d="M38 26 L45 0 L52 26" fill="white"/>
      {/* Right spike */}
      <path d="M50 28 L56 6 L60 30" fill="white"/>
      {/* Far-right angled spike */}
      <path d="M60 32 L76 14 L70 36" fill="white"/>
      {/* Left fringe bang */}
      <path d="M22 42 L16 30 L28 40" fill="white"/>
      {/* Right fringe bang */}
      <path d="M68 40 L74 30 L62 42" fill="white"/>

      {/* ── Dark circle under hair (page BG punch-out) ── */}
      <circle cx="45" cy="62" r="31" fill={bg}/>

      {/* ── Head circle ── */}
      <circle cx="45" cy="62" r="29" fill={bg} stroke="white" strokeWidth="2.6"/>

      {/* ── Ear hints ── */}
      <path d="M16 60 Q13 63 13 67 Q13 71 16 73" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55"/>
      <path d="M74 60 Q77 63 77 67 Q77 71 74 73" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55"/>

      {/* ── Left eye — intense stare ── */}
      <ellipse cx="34" cy="61" rx="7.5" ry="8.5" fill="white"/>
      <circle  cx="34" cy="62"  r="5"   fill={bg}/>
      <circle  cx="32" cy="59"  r="1.8" fill="white"/>

      {/* ── Right eye — cursed seal (concentric target) ── */}
      <ellipse cx="56" cy="61" rx="7.5" ry="8.5" fill="white"/>
      {/* Outer dark */}
      <circle cx="56" cy="61" r="5.5" fill={bg}/>
      {/* Mid white ring */}
      <circle cx="56" cy="61" r="3.5" fill="white"/>
      {/* Inner dark */}
      <circle cx="56" cy="61" r="2"   fill={bg}/>
      {/* Center cursed dot (accent color) */}
      <circle cx="56" cy="61" r="1"   fill={color}/>

      {/* ── Nose ── */}
      <circle cx="45" cy="70" r="1.5" fill="rgba(255,255,255,0.35)"/>

      {/* ── Mouth — confident smirk ── */}
      <path d="M37 78 Q45 84 53 78" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>

      {/* ── Cursed energy halo arc ── */}
      <circle cx="45" cy="62" r="33" fill="none" stroke={color} strokeWidth="0.7" strokeDasharray="4 8" opacity="0.35">
        <animateTransform attributeName="transform" type="rotate" from="0 45 62" to="360 45 62" dur="12s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
}

export function LogoMark({ charColor, variant = "full", className = "" }: LogoMarkProps) {

  if (variant === "sidebar") {
    return (
      <div className={`flex items-center gap-3 ${className}`} style={{ userSelect: "none" }}>
        {/* Compact character icon */}
        <div className="flex-shrink-0" style={{ width: 32, height: 32 }}>
          <SorcererFace color={charColor} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-sm tracking-widest uppercase" style={{ color: charColor }}>Shadow</span>
          <span className="font-display text-sm tracking-widest uppercase text-white/55">Habits</span>
        </div>
      </div>
    );
  }

  /* ── FULL horizontal wordmark ── */
  const txtStyle: React.CSSProperties = {
    fontFamily: "'Arial Black', 'Helvetica Neue', Impact, Arial, sans-serif",
    fontWeight: 900,
    fontSize: "5.2rem",
    letterSpacing: "-0.04em",
    lineHeight: 1,
    color: "#ffffff",
    userSelect: "none",
    display: "block",
  };

  return (
    <div className={`flex flex-col items-center ${className}`} style={{ userSelect: "none" }}>
      {/* Wordmark row */}
      <div className="flex items-end relative" style={{ gap: 0 }}>
        {/* SHA */}
        <span style={txtStyle}>SHA</span>

        {/* Character face — overlaps text, floats above baseline */}
        <div style={{
          width: 86,
          height: 102,
          flexShrink: 0,
          position: "relative",
          zIndex: 10,
          marginLeft: -6,
          marginRight: -6,
          marginBottom: -10,
        }}>
          <SorcererFace color={charColor} />
        </div>

        {/* DOW */}
        <span style={txtStyle}>DOW</span>
      </div>

      {/* HABITS subtitle */}
      <div
        className="flex items-center gap-3 mt-1"
        style={{
          fontFamily: "'Arial Black', Impact, Arial, sans-serif",
          fontWeight: 700,
          fontSize: "0.85rem",
          letterSpacing: "0.55em",
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          userSelect: "none",
        }}
      >
        <span style={{ width: 24, height: 1, background: "rgba(255,255,255,0.18)", display: "inline-block" }} />
        HABITS
        <span style={{ width: 24, height: 1, background: "rgba(255,255,255,0.18)", display: "inline-block" }} />
      </div>

      {/* Accent line */}
      <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, transparent, ${charColor}, transparent)`, marginTop: 4, borderRadius: 1 }} />
    </div>
  );
}
