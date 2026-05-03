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
  sukuna: { jp: "呪王", technique: "Malevolent Shrine", role: "King of Curses" },
  itadori: { jp: "力", technique: "Divergent Fist", role: "Grade 1 Sorcerer" },
  megumi: { jp: "影", technique: "Ten Shadows", role: "Grade 2 Sorcerer" },
  nobara: { jp: "藁", technique: "Straw Doll Technique", role: "Semi-Grade 1 Sorcerer" },
  toji: { jp: "葬", technique: "Heavenly Restriction", role: "Sorcerer Killer" },
  nanami: { jp: "比率", technique: "Ratio Technique", role: "Grade 1 Sorcerer" },
  maki: { jp: "縛", technique: "Heavenly Restriction", role: "Special Grade Sorcerer" },
  inumaki: { jp: "呪言", technique: "Cursed Speech", role: "Semi-Grade 1 Sorcerer" },
  yuta: { jp: "愛", technique: "Rika's Curse", role: "Special Grade Sorcerer" },
  gojo: { jp: "無限", technique: "Limitless", role: "Special Grade Sorcerer" },
  "infinity-mentor": { jp: "無限", technique: "Limitless", role: "Special Grade Sorcerer" },
  "dark-king": { jp: "呪王", technique: "Malevolent Shrine", role: "King of Curses" },
  "energy-hero": { jp: "力", technique: "Divergent Fist", role: "Grade 1 Sorcerer" },
  "shadow-bearer": { jp: "影", technique: "Ten Shadows", role: "Grade 2 Sorcerer" },
  "straw-doll": { jp: "藁", technique: "Straw Doll Technique", role: "Semi-Grade 1 Sorcerer" },
  "ratio-master": { jp: "比率", technique: "Ratio Technique", role: "Grade 1 Sorcerer" },
  "iron-body": { jp: "縛", technique: "Heavenly Restriction", role: "Special Grade Sorcerer" },
  "cursed-voice": { jp: "呪言", technique: "Cursed Speech", role: "Semi-Grade 1 Sorcerer" },
  "best-friend": { jp: "親友", technique: "Boogie Woogie", role: "Grade 1 Sorcerer" },
};

function GojoPattern({ c }: { c: string }) { return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice"><circle cx="140" cy="170" r="120" fill="none" stroke={c} strokeWidth="1" opacity="0.12"><animateTransform attributeName="transform" type="rotate" from="0 140 170" to="360 140 170" dur="18s" repeatCount="indefinite" /></circle><circle cx="140" cy="170" r="70" fill="none" stroke={c} strokeWidth="1" strokeDasharray="6 8" opacity="0.18"><animateTransform attributeName="transform" type="rotate" from="360 140 170" to="0 140 170" dur="9s" repeatCount="indefinite" /></circle><g opacity="0.3"><circle cx="120" cy="120" r="14" fill="none" stroke={c} /><circle cx="160" cy="120" r="14" fill="none" stroke={c} /><circle cx="140" cy="170" r="24" fill="none" stroke={c} /></g></svg>; }
function SukunaPattern({ c }: { c: string }) { return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice"><path d="M50 90 L90 40 L120 95 L145 30 L180 92 L230 50 L220 120 L255 150 L205 175 L235 230 L175 212 L140 285 L108 210 L45 230 L75 175 L25 150 Z" fill="none" stroke={c} strokeWidth="1.1" opacity="0.16" /></svg>; }
function YujiPattern({ c }: { c: string }) { return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice"><circle cx="140" cy="180" r="100" fill="none" stroke={c} strokeWidth="1.3" opacity="0.12"/><circle cx="140" cy="180" r="60" fill="none" stroke={c} strokeWidth="1.8" opacity="0.2"/></svg>; }
function MegumiPattern({ c }: { c: string }) { return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice"><circle cx="140" cy="200" r="92" fill="none" stroke={c} strokeWidth="1.1" strokeDasharray="8 4" opacity="0.16"/></svg>; }
function NobaraPattern({ c }: { c: string }) { return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice"><circle cx="140" cy="180" r="75" fill="none" stroke={c} strokeWidth="1" opacity="0.18"/></svg>; }
function TojiPattern({ c }: { c: string }) { return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice"><line x1="0" y1="60" x2="280" y2="60" stroke={c} strokeWidth="0.5" opacity="0.08" /><line x1="0" y1="120" x2="280" y2="120" stroke={c} strokeWidth="0.5" opacity="0.08" /><line x1="140" y1="110" x2="140" y2="250" stroke={c} strokeWidth="1" strokeDasharray="4 5" opacity="0.18" /></svg>; }
function NanamiPattern({ c }: { c: string }) { return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice"><line x1="40" y1="210" x2="240" y2="210" stroke={c} strokeWidth="2" opacity="0.22" /></svg>; }
function MakiPattern({ c }: { c: string }) { return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice"><path d="M60 80 L220 80 L180 260 L100 260 Z" fill="none" stroke={c} strokeWidth="1" opacity="0.12" /></svg>; }
function InumakiPattern({ c }: { c: string }) { return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice"><circle cx="140" cy="190" r="90" fill="none" stroke={c} strokeWidth="1" opacity="0.14" strokeDasharray="3 8" /></svg>; }
function YutaPattern({ c }: { c: string }) { return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice"><circle cx="140" cy="170" r="120" fill="none" stroke={c} strokeWidth="1" opacity="0.14" /><circle cx="140" cy="170" r="85" fill="none" stroke={c} strokeWidth="1" strokeDasharray="10 10" opacity="0.18" /></svg>; }
function TodoPattern({ c }: { c: string }) { return <svg className="absolute inset-0 w-full h-full" viewBox="0 0 280 340" preserveAspectRatio="xMidYMid slice"><circle cx="140" cy="180" r="110" fill="none" stroke={c} strokeWidth="1" opacity="0.14" /></svg>; }
function PatternForCharacter({ character, c }: { character: string; c: string }) { switch (character) { case "gojo": case "infinity-mentor": return <GojoPattern c={c} />; case "sukuna": case "dark-king": return <SukunaPattern c={c} />; case "itadori": case "energy-hero": return <YujiPattern c={c} />; case "megumi": case "shadow-bearer": return <MegumiPattern c={c} />; case "nobara": case "straw-doll": return <NobaraPattern c={c} />; case "toji": return <TojiPattern c={c} />; case "nanami": case "ratio-master": return <NanamiPattern c={c} />; case "maki": case "iron-body": return <MakiPattern c={c} />; case "inumaki": case "cursed-voice": return <InumakiPattern c={c} />; case "yuta": case "best-friend": return <YutaPattern c={c} />; default: return <YujiPattern c={c} />; } }

export function CharacterHeroPanel({ character, charColor, charGlow, charGlowSoft, companionImg, companionName, companionMessage, }: Props) {
  const lore = LORE[character] ?? LORE.itadori;
  return <div className="relative overflow-hidden" style={{ flex: "0 0 58%" }}><div className="absolute inset-0" style={{ background: `linear-gradient(160deg, rgba(4,8,20,0.95) 0%, rgba(6,10,24,0.98) 100%)` }} /><PatternForCharacter character={character} c={charColor} /><div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 70% 80%, ${charColor}18 0%, transparent 55%)` }} /><div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, ${charColor}06 0%, transparent 40%)` }} /><div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"><motion.span key={character} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.0, ease: "easeOut" }} style={{ fontSize: 72, fontWeight: 900, fontFamily: "serif", color: charColor, opacity: 0.07, lineHeight: 1, letterSpacing: "0.1em" }}>{lore.jp}</motion.span></div><div className="absolute top-4 left-4 z-20" style={{ maxWidth: "calc(100% - 24px)" }}><AnimatePresence mode="wait"><motion.div key={companionMessage ?? "idle"} initial={{ opacity: 0, y: 8, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="relative"><div className="relative rounded-2xl rounded-bl-sm px-4 py-3 overflow-hidden" style={{ background: "rgba(5,9,22,0.92)", backdropFilter: "blur(24px)", border: `1px solid ${charColor}30`, boxShadow: `0 8px 28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)` }}><div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl" style={{ background: `linear-gradient(180deg, ${charColor}, ${charColor}30)` }} /><p className="text-[12px] leading-relaxed pl-2 font-medium" style={{ color: "rgba(255,255,255,0.88)", maxWidth: 200 }}>{companionMessage || "Ready when you are."}</p></div></motion.div></AnimatePresence></div><div className="absolute bottom-12 right-4 z-10"><div className="relative rounded-full overflow-hidden" style={{ width: 88, height: 88, border: `2px solid ${charColor}55`, boxShadow: `0 0 30px ${charGlow}, 0 0 0 4px ${charColor}12` }}><img src={companionImg} alt={companionName} className="w-full h-full object-cover" style={{ filter: `brightness(1.1) saturate(1.2) drop-shadow(0 0 4px ${charColor}66)` }} /><div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 35% 35%, transparent 40%, ${charColor}18)` }} /></div></div><div className="absolute bottom-4 left-4 z-10"><div className="flex items-center gap-1.5 mb-0.5"><motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: charColor, boxShadow: `0 0 6px ${charGlow}` }} /><span className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: charColor }}>{companionName}</span></div><p className="text-[9px] uppercase tracking-[0.12em] pl-3" style={{ color: "rgba(255,255,255,0.3)" }}>{lore.technique}</p></div></div>;
}
