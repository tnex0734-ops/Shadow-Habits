import { motion, AnimatePresence } from "framer-motion";

interface Props {
  character: string;
  charColor: string;
  charGlow: string;
  charGlowSoft: string;
  companionImg: string;
  companionName: string;
  companionMessage: string | undefined;
}

const LORE: Record<string, { jp: string; technique: string; role: string }> = {
  "infinity-mentor": { jp: "無限", technique: "Limitless",           role: "Special Grade Sorcerer" },
  "dark-king":       { jp: "呪王", technique: "Malevolent Shrine",   role: "King of Curses" },
  "energy-hero":     { jp: "力",   technique: "Divergent Fist",      role: "Vessel of Ryomen Sukuna" },
  "shadow-bearer":   { jp: "影",   technique: "Ten Shadows",         role: "Grade 2 Sorcerer" },
  "straw-doll":      { jp: "藁",   technique: "Straw Doll Technique",role: "Grade 3 Sorcerer" },
  "ratio-master":    { jp: "比率", technique: "Ratio Technique",     role: "Grade 1 Sorcerer" },
  "iron-body":       { jp: "縛",   technique: "Heavenly Restriction", role: "Special Grade Sorcerer" },
  "cursed-voice":    { jp: "呪言", technique: "Cursed Speech",       role: "Semi-Grade 1 Sorcerer" },
  "best-friend":     { jp: "親友", technique: "Boogie Woogie",       role: "Grade 1 Sorcerer" },
};

/* ── per-character SVG technique patterns ── */
function GojoPattern({ c }: { c: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice">
      {/* Six-eyes grid */}
      {[[90,110],[170,110],[55,170],[200,170],[80,230],[175,230]].map(([cx,cy], i) => (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx="14" ry="10" fill="none" stroke={c} strokeWidth="0.8" opacity="0.18">
            <animate attributeName="opacity" values="0.18;0.38;0.18" dur={`${2.4+i*0.4}s`} repeatCount="indefinite" />
          </ellipse>
          <ellipse cx={cx} cy={cy} rx="5" ry="4" fill={c} opacity="0.14">
            <animate attributeName="opacity" values="0.14;0.3;0.14" dur={`${2.4+i*0.4}s`} repeatCount="indefinite" />
          </ellipse>
        </g>
      ))}
      {/* Rotating concentric rings */}
      {[60,95,130,165].map((r, i) => (
        <circle key={r} cx="140" cy="190" r={r} fill="none" stroke={c} strokeWidth="0.6" strokeDasharray="6 10" opacity="0.12">
          <animateTransform attributeName="transform" type="rotate"
            from={`${i%2===0?0:360} 140 190`} to={`${i%2===0?360:0} 140 190`}
            dur={`${12+i*5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Infinity symbol */}
      <path d="M90 190 C90 165 115 150 140 190 C165 230 190 215 190 190 C190 165 165 150 140 190 C115 230 90 215 90 190 Z"
        fill="none" stroke={c} strokeWidth="1.8" opacity="0.22" strokeDasharray="400">
        <animate attributeName="stroke-dashoffset" from="400" to="0" dur="6s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function SukunaPattern({ c }: { c: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice">
      {/* Tattoo diamond grid */}
      {Array.from({length:6},(_,row)=>Array.from({length:5},(_,col)=>(
        <g key={`${row}-${col}`} transform={`translate(${28+col*48},${30+row*55})`}>
          <path d="M0 -14 L10 0 L0 14 L-10 0 Z" fill="none" stroke={c} strokeWidth="0.7" opacity="0.16">
            <animate attributeName="opacity" values="0.16;0.32;0.16" dur={`${3+col*0.5}s`} repeatCount="indefinite" />
          </path>
        </g>
      )))}
      {/* Flame wisps from bottom */}
      {[80,130,175,220].map((x,i) => (
        <path key={i} d={`M${x} 340 C${x-8} ${300-i*10} ${x+6} ${260-i*8} ${x} ${230-i*12}`}
          fill="none" stroke={c} strokeWidth="1.5" opacity="0.2" strokeLinecap="round">
          <animate attributeName="d"
            values={`M${x} 340 C${x-8} 310 ${x+6} 270 ${x} 240;M${x} 340 C${x+8} 305 ${x-6} 265 ${x} 235;M${x} 340 C${x-8} 310 ${x+6} 270 ${x} 240`}
            dur={`${2.5+i*0.7}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* Eye motifs */}
      {[[100,120],[180,180],[120,260]].map(([cx,cy],i)=>(
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx="18" ry="9" fill="none" stroke={c} strokeWidth="1" opacity="0.2" />
          <ellipse cx={cx} cy={cy} rx="6" ry="6" fill={c} opacity="0.18">
            <animate attributeName="ry" values="6;2;6" dur={`${4+i}s`} repeatCount="indefinite" />
          </ellipse>
        </g>
      ))}
    </svg>
  );
}

function YujiPattern({ c }: { c: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice">
      {/* Impact rings expanding */}
      {[30,60,90,120,155].map((r,i)=>(
        <circle key={r} cx="140" cy="180" r={r} fill="none" stroke={c} strokeWidth={1.5-i*0.2} opacity="0.18">
          <animate attributeName="r" values={`${r};${r+20};${r}`} dur={`${3+i*0.6}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.18;0.06;0.18" dur={`${3+i*0.6}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Burst lines */}
      {Array.from({length:12},(_,i)=>{
        const angle = (i/12)*Math.PI*2;
        const x1 = 140+50*Math.cos(angle), y1 = 180+50*Math.sin(angle);
        const x2 = 140+130*Math.cos(angle), y2 = 180+130*Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth="0.8" opacity="0.15">
            <animate attributeName="opacity" values={`0.15;0.3;0.15`} dur={`${2+i*0.2}s`} repeatCount="indefinite" />
          </line>
        );
      })}
      {/* Divergent fist impact mark */}
      <path d="M120 160 L140 140 L160 160 M115 175 L140 165 L165 175 M120 195 L140 205 L160 195"
        fill="none" stroke={c} strokeWidth="2" opacity="0.25" strokeLinecap="round" />
    </svg>
  );
}

function MegumiPattern({ c }: { c: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice">
      {/* Summoning circle */}
      <circle cx="140" cy="200" r="90" fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="8 4" opacity="0.2">
        <animateTransform attributeName="transform" type="rotate" from="0 140 200" to="360 140 200" dur="18s" repeatCount="indefinite" />
      </circle>
      <circle cx="140" cy="200" r="65" fill="none" stroke={c} strokeWidth="0.8" strokeDasharray="4 8" opacity="0.15">
        <animateTransform attributeName="transform" type="rotate" from="360 140 200" to="0 140 200" dur="12s" repeatCount="indefinite" />
      </circle>
      {/* Pentagram lines inside circle */}
      {Array.from({length:5},(_,i)=>{
        const a = (i/5)*Math.PI*2 - Math.PI/2;
        const b = ((i+2)/5)*Math.PI*2 - Math.PI/2;
        return (
          <line key={i}
            x1={140+65*Math.cos(a)} y1={200+65*Math.sin(a)}
            x2={140+65*Math.cos(b)} y2={200+65*Math.sin(b)}
            stroke={c} strokeWidth="0.7" opacity="0.18" />
        );
      })}
      {/* Shadow tendrils from bottom */}
      {[60,100,140,180,220].map((x,i)=>(
        <path key={i}
          d={`M${x} 340 Q${x+15-i*6} ${290-i*8} ${x-5+i*4} ${240-i*10} Q${x+10} ${210} ${x+i*3} ${185}`}
          fill="none" stroke={c} strokeWidth="1.5" opacity="0.18" strokeLinecap="round">
          <animate attributeName="d"
            values={`M${x} 340 Q${x+15} 295 ${x} 245 Q${x+10} 210 ${x} 185;M${x} 340 Q${x-15} 290 ${x} 240 Q${x-10} 215 ${x} 185;M${x} 340 Q${x+15} 295 ${x} 245 Q${x+10} 210 ${x} 185`}
            dur={`${3+i*0.6}s`} repeatCount="indefinite" />
        </path>
      ))}
    </svg>
  );
}

function NobaraPattern({ c }: { c: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice">
      {/* Resonance circles */}
      {[40,75,110,150].map((r,i)=>(
        <circle key={r} cx="140" cy="185" r={r} fill="none" stroke={c} strokeWidth="0.9" opacity="0.15">
          <animate attributeName="r" values={`${r};${r+15};${r}`} dur={`${4+i}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.05;0.15" dur={`${4+i}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Floating nails/petals */}
      {Array.from({length:8},(_,i)=>{
        const x=50+i*25, y=80+Math.sin(i)*40;
        return (
          <g key={i}>
            <line x1={x} y1={y} x2={x} y2={y+20} stroke={c} strokeWidth="2" opacity="0.25" strokeLinecap="round">
              <animate attributeName="y1" values={`${y};${y-12};${y}`} dur={`${2.5+i*0.4}s`} repeatCount="indefinite" />
              <animate attributeName="y2" values={`${y+20};${y+8};${y+20}`} dur={`${2.5+i*0.4}s`} repeatCount="indefinite" />
            </line>
            <circle cx={x} cy={y} r="3" fill={c} opacity="0.3">
              <animate attributeName="cy" values={`${y};${y-12};${y}`} dur={`${2.5+i*0.4}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
      {/* Straw doll outline hint */}
      <path d="M130 230 L130 270 M140 230 L140 280 M150 230 L150 270 M120 235 L160 235"
        stroke={c} strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
    </svg>
  );
}

function NanamiPattern({ c }: { c: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice">
      {/* Grid mesh */}
      {Array.from({length:8},(_,i)=>(
        <line key={`v${i}`} x1={35+i*30} y1="0" x2={35+i*30} y2="340" stroke={c} strokeWidth="0.4" opacity="0.1" />
      ))}
      {Array.from({length:12},(_,i)=>(
        <line key={`h${i}`} x1="0" y1={28+i*28} x2="280" y2={28+i*28} stroke={c} strokeWidth="0.4" opacity="0.1" />
      ))}
      {/* 7:3 Ratio golden dividing line */}
      <line x1="0" y1="238" x2="280" y2="238" stroke={c} strokeWidth="2" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.6;0.35" dur="3s" repeatCount="indefinite" />
      </line>
      <text x="248" y="232" fontSize="9" fill={c} opacity="0.5" fontFamily="monospace">7:3</text>
      {/* Ratio technique cross-mark */}
      <path d="M90 170 L190 170" stroke={c} strokeWidth="1.5" opacity="0.25" strokeDasharray="4 3" />
      <path d="M140 120 L140 220" stroke={c} strokeWidth="1.5" opacity="0.25" strokeDasharray="4 3" />
      <circle cx="140" cy="170" r="4" fill={c} opacity="0.4">
        <animate attributeName="r" values="4;7;4" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.15;0.4" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function MakiPattern({ c }: { c: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice">
      {/* Heavenly Restriction — clean geometric shapes, sparse */}
      {/* Triangular geometric field */}
      {[[140,80,80,200,200,200],[60,120,140,60,140,200],[200,100,260,200,140,200]].map(([x1,y1,x2,y2,x3,y3],i)=>(
        <polygon key={i} points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
          fill="none" stroke={c} strokeWidth="0.7" opacity="0.14">
          <animate attributeName="opacity" values={`0.14;0.28;0.14`} dur={`${5+i*2}s`} repeatCount="indefinite" />
        </polygon>
      ))}
      {/* Staff/spear silhouette */}
      <line x1="140" y1="40" x2="140" y2="300" stroke={c} strokeWidth="2.5" opacity="0.22" strokeLinecap="round" />
      <path d="M130 55 L140 40 L150 55" fill={c} opacity="0.3" />
      {/* Horizontal scan lines — "no wasted energy" */}
      {[130,160,190,220].map(y=>(
        <line key={y} x1="60" y1={y} x2="220" y2={y} stroke={c} strokeWidth="0.5" opacity="0.1">
          <animate attributeName="x1" values="60;0;60" dur="6s" repeatCount="indefinite" />
          <animate attributeName="x2" values="220;280;220" dur="6s" repeatCount="indefinite" />
        </line>
      ))}
    </svg>
  );
}

function InumakiPattern({ c }: { c: string }) {
  const kanji = ["呪","言","停","爆","捻","腐","消","滅"];
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice">
      {/* Sound wave ripples */}
      {[30,55,80,108,138].map((r,i)=>(
        <ellipse key={r} cx="140" cy="210" rx={r*1.5} ry={r*0.7}
          fill="none" stroke={c} strokeWidth="0.9" opacity="0.14">
          <animate attributeName="rx" values={`${r*1.5};${r*1.5+20};${r*1.5}`} dur={`${3+i*0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.14;0.04;0.14" dur={`${3+i*0.5}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
      {/* Floating kanji */}
      {kanji.map((k,i)=>{
        const x=30+Math.sin(i*1.3)*60+i*26, y=50+Math.cos(i*0.9)*40+i*28;
        return (
          <text key={i} x={x} y={y} fontSize="18" fill={c} opacity="0.2" fontFamily="serif">
            {k}
            <animate attributeName="opacity" values={`0.2;0.4;0.2`} dur={`${2+i*0.5}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`${y};${y-10};${y}`} dur={`${3+i*0.6}s`} repeatCount="indefinite" />
          </text>
        );
      })}
      {/* Snake seal marks */}
      <path d="M80 280 Q110 260 140 280 Q170 300 200 280" fill="none" stroke={c} strokeWidth="1.5" opacity="0.22" strokeLinecap="round" />
    </svg>
  );
}

function TodoPattern({ c }: { c: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice">
      {/* Boogie Woogie portal — swirling rings */}
      {[35,60,85,110,140].map((r,i)=>(
        <circle key={r} cx="140" cy="185" r={r} fill="none" stroke={c}
          strokeWidth={i===0?2:0.8} strokeDasharray={i===0?"8 4":undefined} opacity={i===0?0.4:0.15}>
          <animateTransform attributeName="transform" type="rotate"
            from={`${i%2===0?0:360} 140 185`} to={`${i%2===0?360:0} 140 185`}
            dur={`${5+i*3}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${i===0?0.4:0.15};${i===0?0.65:0.3};${i===0?0.4:0.15}`}
            dur={`${5+i*3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Starburst from center */}
      {Array.from({length:10},(_,i)=>{
        const angle=(i/10)*Math.PI*2;
        const x1=140+40*Math.cos(angle), y1=185+40*Math.sin(angle);
        const x2=140+120*Math.cos(angle), y2=185+120*Math.sin(angle);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth="1" opacity="0.2">
            <animate attributeName="x2" values={`${x2};${x2*1.04};${x2}`} dur={`${2+i*0.3}s`} repeatCount="indefinite" />
          </line>
        );
      })}
      {/* Clapping hands silhouette */}
      <path d="M100 280 Q115 265 130 275 Q120 255 140 260 Q155 255 145 275 Q160 265 175 280"
        fill="none" stroke={c} strokeWidth="2" opacity="0.28" strokeLinecap="round" />
    </svg>
  );
}

function PatternForCharacter({ character, c }: { character: string; c: string }) {
  switch (character) {
    case "infinity-mentor": return <GojoPattern c={c} />;
    case "dark-king":       return <SukunaPattern c={c} />;
    case "energy-hero":     return <YujiPattern c={c} />;
    case "shadow-bearer":   return <MegumiPattern c={c} />;
    case "straw-doll":      return <NobaraPattern c={c} />;
    case "ratio-master":    return <NanamiPattern c={c} />;
    case "iron-body":       return <MakiPattern c={c} />;
    case "cursed-voice":    return <InumakiPattern c={c} />;
    case "best-friend":     return <TodoPattern c={c} />;
    default:                return <GojoPattern c={c} />;
  }
}

export function CharacterHeroPanel({
  character, charColor, charGlow, charGlowSoft,
  companionImg, companionName, companionMessage,
}: Props) {
  const lore = LORE[character] ?? LORE["infinity-mentor"];

  return (
    <div className="relative overflow-hidden" style={{ flex: "0 0 58%" }}>

      {/* ── Deep dark base ── */}
      <div className="absolute inset-0"
        style={{ background: `linear-gradient(160deg, rgba(4,8,20,0.95) 0%, rgba(6,10,24,0.98) 100%)` }} />

      {/* ── Technique pattern ── */}
      <PatternForCharacter character={character} c={charColor} />

      {/* ── Color atmosphere overlays ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 70% 80%, ${charColor}18 0%, transparent 55%)` }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(180deg, ${charColor}06 0%, transparent 40%)` }} />

      {/* ── Top-edge highlight ── */}
      <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${charColor}40 40%, transparent)` }} />

      {/* ── HUGE Japanese watermark ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span
          key={character}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          style={{
            fontSize: 72,
            fontWeight: 900,
            fontFamily: "serif",
            color: charColor,
            opacity: 0.07,
            lineHeight: 1,
            letterSpacing: "0.1em",
            userSelect: "none",
          }}
        >
          {lore.jp}
        </motion.span>
      </div>

      {/* ── Speech bubble — top left ── */}
      <div className="absolute top-4 left-4 z-20" style={{ maxWidth: "calc(100% - 24px)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={companionMessage ?? "idle"}
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative rounded-2xl rounded-bl-sm px-4 py-3 overflow-hidden"
              style={{
                background: "rgba(5,9,22,0.92)",
                backdropFilter: "blur(24px)",
                border: `1px solid ${charColor}30`,
                boxShadow: `0 8px 28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)`,
              }}
            >
              {/* Accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl"
                style={{ background: `linear-gradient(180deg, ${charColor}, ${charColor}30)` }} />
              <p className="text-[12px] leading-relaxed pl-2 font-medium"
                style={{ color: "rgba(255,255,255,0.88)", maxWidth: 200 }}>
                {companionMessage || "Ready when you are."}
              </p>
            </div>
            {/* Triangle tail */}
            <div className="absolute left-5" style={{
              bottom: -8, width: 0, height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: `8px solid ${charColor}30`,
            }} />
            <div className="absolute left-5" style={{
              bottom: -6, width: 0, height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: "7px solid rgba(5,9,22,0.92)",
            }} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Portrait avatar — bottom right ── */}
      <div className="absolute bottom-12 right-4 z-10">
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Glow disc behind portrait */}
          <div className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              transform: "scale(1.8)",
              background: `radial-gradient(circle, ${charColor}28, transparent 65%)`,
              filter: "blur(8px)",
            }} />
          {/* Outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: `1.5px dashed ${charColor}35`, margin: -4 }}
          />
          {/* Portrait frame */}
          <div className="relative rounded-full overflow-hidden"
            style={{
              width: 88, height: 88,
              border: `2px solid ${charColor}55`,
              boxShadow: `0 0 30px ${charGlow}, 0 0 0 4px ${charColor}12`,
            }}
          >
            <img src={companionImg} alt={companionName}
              className="w-full h-full object-cover"
              style={{ filter: `brightness(1.1) saturate(1.2) drop-shadow(0 0 4px ${charColor}66)` }}
            />
            {/* Overlay colour tint */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(circle at 35% 35%, transparent 40%, ${charColor}18)` }} />
          </div>
        </motion.div>
      </div>

      {/* ── Name + technique — bottom left ── */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="flex items-center gap-1.5 mb-0.5">
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: charColor, boxShadow: `0 0 6px ${charGlow}` }}
          />
          <span className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: charColor }}>
            {companionName}
          </span>
        </div>
        <p className="text-[9px] uppercase tracking-[0.12em] pl-3" style={{ color: "rgba(255,255,255,0.3)" }}>
          {lore.technique}
        </p>
      </div>

    </div>
  );
}
