import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetHabits, getGetHabitsQueryKey,
  useCompleteHabit, useUncompleteHabit,
  useGetDashboardSummary, getGetDashboardSummaryQueryKey,
  useGetCompanionMessage, getGetCompanionMessageQueryKey,
  useGetInsights, getGetInsightsQueryKey,
  useGetStreaks, getGetStreaksQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/contexts/ThemeContext";
import { getTodayStr, formatDate } from "@/lib/utils";
import { Flame, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CharacterHeroPanel } from "@/components/CharacterHeroPanel";
import { useAuth } from "@/contexts/AuthContext";

function HabitRow({ habit }: { habit: { id: number; title: string; completedDates: unknown; currentStreak: number } }) {
  const queryClient = useQueryClient();
  const { charColor, charGlow } = useTheme();
  const today = getTodayStr();
  const isCompleted = (habit.completedDates as string[]).includes(today);
  const [flash, setFlash] = useState(false);
  const inv = () => [getGetHabitsQueryKey, getGetDashboardSummaryQueryKey, getGetCompanionMessageQueryKey, getGetInsightsQueryKey, getGetStreaksQueryKey].forEach((k) => queryClient.invalidateQueries({ queryKey: k() }));
  const completeMutation = useCompleteHabit({ mutation: { onSuccess: () => { setFlash(true); setTimeout(() => setFlash(false), 500); inv(); } } });
  const uncompleteMutation = useUncompleteHabit({ mutation: { onSuccess: inv } });
  const busy = completeMutation.isPending || uncompleteMutation.isPending;
  return (
    <motion.div layout className={cn("flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all relative overflow-hidden", flash && "black-flash")} style={{ background: isCompleted ? `linear-gradient(135deg, ${charColor}0d 0%, rgba(255,255,255,0.02) 100%)` : "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)", border: `1px solid ${isCompleted ? charColor + "22" : "rgba(255,255,255,0.06)"}`, boxShadow: isCompleted ? `0 4px 20px ${charColor}0e, inset 0 1px 0 rgba(255,255,255,0.06)` : "0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)" }} data-testid={`habit-card-${habit.id}`}>
      <motion.button onClick={() => { if (busy) return; isCompleted ? uncompleteMutation.mutate({ id: String(habit.id), data: { date: today } }) : completeMutation.mutate({ id: String(habit.id), data: { date: today } }); }} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.88 }} disabled={busy} className="w-8 h-8 rounded-xl flex-shrink-0 relative overflow-hidden disabled:opacity-40" style={isCompleted ? { background: `${charColor}20`, boxShadow: `0 0 16px ${charColor}40, inset 0 1px 0 rgba(255,255,255,0.1)`, border: `1.5px solid ${charColor}60` } : { background: "rgba(255,255,255,0.04)", border: "1.5px dashed rgba(255,255,255,0.18)" }} />
      <span className="flex-1 text-sm font-medium leading-snug tracking-wide" style={{ color: isCompleted ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.88)", textDecoration: isCompleted ? "line-through" : "none" }}>{habit.title}</span>
      {habit.currentStreak > 0 && <span className="text-xs font-bold flex-shrink-0 tabular-nums" style={{ color: charColor, textShadow: `0 0 10px ${charGlow}`, letterSpacing: "0.04em" }}>{habit.currentStreak}d</span>}
    </motion.div>
  );
}

function ChartTip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  const { charColor } = useTheme();
  if (!active || !payload?.length) return null;
  return <div className="px-3 py-2 rounded-xl text-xs border" style={{ background: "rgba(4,12,22,0.96)", borderColor: `${charColor}30`, backdropFilter: "blur(12px)" }}><p style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p><p className="font-bold mt-0.5" style={{ color: charColor }}>{payload[0].value} completed</p></div>;
}

function JpSymbolsBg() {
  return <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.12] select-none"><div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0 2px, transparent 2px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.06) 0 1px, transparent 1px), radial-gradient(circle at 30% 80%, rgba(255,255,255,0.05) 0 2px, transparent 2px)", backgroundColor: "transparent" }} /><div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent 0 46px, rgba(255,255,255,0.03) 46px 48px), repeating-linear-gradient(-45deg, transparent 0 54px, rgba(255,255,255,0.02) 54px 56px)" }} /><div className="absolute -left-20 top-10 text-[180px] font-black text-white/[0.04]">呪</div><div className="absolute right-0 top-40 text-[220px] font-black text-white/[0.03]">術</div><div className="absolute left-1/3 bottom-0 text-[160px] font-black text-white/[0.035]">影</div></div>;
}

export default function DashboardPage() {
  const { charColor, charGlow, charGlowSoft } = useTheme();
  const { user } = useAuth();
  const { data: habits = [] } = useGetHabits();
  const { data: summary } = useGetDashboardSummary();
  const { data: companion } = useGetCompanionMessage();
  const today = getTodayStr();
  const done = habits.filter((h) => (h.completedDates as string[]).includes(today));
  const remaining = habits.filter((h) => !(h.completedDates as string[]).includes(today));
  const total = habits.length;
  const pct = total > 0 ? Math.round((done.length / total) * 100) : 0;
  const streakAtRisk = remaining.filter((h) => (h as { currentStreak?: number }).currentStreak! > 0);
  const chart7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return { day: d.toLocaleDateString("en", { weekday: "narrow" }), count: habits.filter((h) => (h.completedDates as string[]).includes(formatDate(d))).length, isToday: formatDate(d) === today }; });
  const charImgMap: Record<string, string> = { sukuna: "/src/assets/character-dark.png", itadori: "/src/assets/character-energy.png", megumi: "/src/assets/character-megumi.png", nobara: "/src/assets/character-nobara.png", toji: "/src/assets/character-toji.png", nanami: "/src/assets/character-nanami.png", maki: "/src/assets/character-maki.png", inumaki: "/src/assets/character-inumaki.png", yuta: "/src/assets/character-yuta.png", gojo: "/src/assets/character-gojo.png", "infinity-mentor": "/src/assets/character-gojo.png", "dark-king": "/src/assets/character-dark.png", "energy-hero": "/src/assets/character-energy.png", "shadow-bearer": "/src/assets/character-megumi.png", "straw-doll": "/src/assets/character-nobara.png", "ratio-master": "/src/assets/character-nanami.png", "iron-body": "/src/assets/character-maki.png", "cursed-voice": "/src/assets/character-inumaki.png", "best-friend": "/src/assets/character-yuta.png" };
  const charNameMap: Record<string, string> = { sukuna: "Sukuna", itadori: "Itadori", megumi: "Megumi Fushiguro", nobara: "Nobara Kugisaki", toji: "Toji Fushiguro", nanami: "Nanami Kento", maki: "Maki Zenin", inumaki: "Toge Inumaki", yuta: "Yuta Okkotsu", gojo: "Gojo Satoru", "infinity-mentor": "Gojo Satoru", "dark-king": "Sukuna", "energy-hero": "Itadori", "shadow-bearer": "Megumi Fushiguro", "straw-doll": "Nobara Kugisaki", "ratio-master": "Nanami Kento", "iron-body": "Maki Zenin", "cursed-voice": "Toge Inumaki", "best-friend": "Yuta Okkotsu" };
  const companionImg = charImgMap[companion?.character ?? ""] ?? "/src/assets/character-gojo.png";
  const companionName = charNameMap[companion?.character ?? ""] ?? "Gojo Satoru";
  const gradId = `cg-${charColor.replace("#", "")}`;
  return (
    <div className="h-full relative overflow-hidden">
      <JpSymbolsBg />
      <div className="relative h-full flex flex-col px-6 pt-5 pb-3 gap-4 overflow-hidden max-w-5xl mx-auto w-full">
        <AnimatePresence>
          {streakAtRisk.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm"
              style={{ backgroundColor: "rgba(255,130,0,0.07)", borderColor: "rgba(255,130,0,0.2)", color: "#FFAA55" }}
            >
              <Flame className="w-4 h-4 flame-icon flex-shrink-0" style={{ color: "#FFA000" }} />
              <span>{streakAtRisk.length === 1 ? `"${streakAtRisk[0].title}" needs one more finish today` : `${streakAtRisk.length} habits are one step from a reset — finish strong`}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
          <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-1.5 pr-0.5">
              {remaining.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest px-1 pb-1" style={{ color: "rgba(255,255,255,0.25)" }}>What’s left — {remaining.length}</p>
                  {remaining.map((h) => <HabitRow key={h.id} habit={h} />)}
                </div>
              )}
              {done.length > 0 && (
                <div className="space-y-1.5 mt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest px-1 pb-1" style={{ color: "rgba(255,255,255,0.16)" }}>Already cleared — {done.length}</p>
                  {done.map((h) => <HabitRow key={h.id} habit={h} />)}
                </div>
              )}
              {habits.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 pt-10 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: `1px solid ${charColor}20`, boxShadow: `0 0 24px ${charColor}10` }}>
                    <Plus className="w-7 h-7" style={{ color: `${charColor}60` }} />
                  </div>
                  <div>
                    <p className="font-semibold text-white/50 text-base">No habits yet</p>
                    <p className="text-sm text-white/25 mt-1">Start with one small win today</p>
                  </div>
                  <Link href="/habits">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="px-6 py-3 rounded-2xl font-bold text-sm" style={{ background: `linear-gradient(135deg, ${charColor}dd, ${charColor})`, color: "#000", boxShadow: `0 0 24px ${charGlow}, 0 4px 16px rgba(0,0,0,0.3)` }}>Create your first vow</motion.button>
                  </Link>
                </div>
              )}
            </div>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="flex-shrink-0 flex items-stretch rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.035)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
              {[{ label: "Best Streak", value: `${summary?.longestStreak ?? 0}d`, note: "Longest chain" }, { label: "Habits", value: summary?.totalHabits ?? 0, note: "Tracked vows" }, { label: "All-Time", value: summary?.totalCompletions ?? 0, note: "Total finishes" }].map(({ label, value, note }, i) => (
                <div key={label} className="flex-1 flex flex-col items-center justify-center py-3 relative">
                  {i > 0 && <div className="absolute left-0 top-2 bottom-2 w-px" style={{ background: "rgba(255,255,255,0.07)" }} />}
                  <span className="text-base font-bold leading-none" style={{ color: charColor }}>{value}</span>
                  <span className="text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</span>
                  <span className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.16)" }}>{note}</span>
                </div>
              ))}
            </motion.div>
            <div className="flex-shrink-0 rounded-2xl overflow-hidden" style={{ height: 140, background: "rgba(255,255,255,0.025)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="px-4 pt-3 pb-1"><p className="text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.25)" }}>Last 7 Days</p></div>
              <div style={{ height: 104 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart7} margin={{ top: 4, right: 12, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={charColor} stopOpacity={0.45} />
                        <stop offset="80%" stopColor={charColor} stopOpacity={0.04} />
                        <stop offset="100%" stopColor={charColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.28)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.18)" }} axisLine={false} tickLine={false} allowDecimals={false} width={20} />
                    <Tooltip content={<ChartTip />} cursor={{ stroke: `${charColor}20`, strokeWidth: 1 }} />
                    <Area type="monotoneX" dataKey="count" stroke={charColor} strokeWidth={2} fill={`url(#${gradId})`} isAnimationActive animationDuration={1000} animationEasing="ease-out" dot={(props: { cx: number; cy: number; payload: { isToday: boolean } }) => { const { cx, cy, payload } = props; if (payload.isToday) return <g key={`td-${cx}`}><circle cx={cx} cy={cy} r={6} fill={charColor} fillOpacity={0.18}><animate attributeName="r" values="4;9;4" dur="2.2s" repeatCount="indefinite" /><animate attributeName="fill-opacity" values="0.22;0.04;0.22" dur="2.2s" repeatCount="indefinite" /></circle><circle cx={cx} cy={cy} r={4} fill="#060a14" stroke={charColor} strokeWidth={1.5} style={{ filter: `drop-shadow(0 0 5px ${charGlow})` }} /></g>; return <circle key={`d-${cx}`} cx={cx} cy={cy} r={2.5} fill={charColor} fillOpacity={0.5} />; }} activeDot={{ r: 4, fill: charColor, stroke: "#060a14", strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="flex flex-col min-h-0 rounded-3xl overflow-hidden relative" style={{ background: "rgba(6,10,20,0.82)", backdropFilter: "blur(32px)", border: `1px solid rgba(255,255,255,0.07)`, boxShadow: `0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px ${charColor}0a` }}>
            <CharacterHeroPanel character={user?.selectedCharacter ?? "itadori"} charColor={charColor} charGlow={charGlow} charGlowSoft={charGlowSoft} companionImg={companionImg} companionName={companionName} companionMessage={companion?.message} />
            <div className="flex-shrink-0 h-px mx-0" style={{ background: `linear-gradient(90deg, ${charColor}00, ${charColor}28 30%, ${charColor}28 70%, ${charColor}00)` }} />
            <div className="flex flex-col justify-center px-5 py-4 relative" style={{ flex: "0 0 42%" }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 100%, ${charColor}0d, transparent 60%)` }} />
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] mb-3 relative z-10" style={{ color: "rgba(255,255,255,0.25)" }}>Today’s Progress</p>
              {total > 0 ? (
                <div className="relative z-10 flex items-center gap-4">
                  <div className="flex-shrink-0 relative" style={{ width: 80, height: 80 }}>
                    <div className="w-full h-full rounded-full" style={{ background: `conic-gradient(${charColor} ${pct * 3.6}deg, rgba(255,255,255,0.06) 0deg)`, padding: 4 }}>
                      <div className="w-full h-full rounded-full flex flex-col items-center justify-center" style={{ background: "#060d14" }}>
                        <span className="text-lg font-bold leading-none" style={{ color: charColor }}>{pct}%</span>
                        <span className="text-[8px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{done.length}/{total}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: `0 0 24px ${charColor}30` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: charColor }}>Finish the day strong</p>
                    <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                      <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: "easeOut" }} style={{ background: `linear-gradient(90deg, ${charColor}88, ${charColor})`, boxShadow: `0 0 10px ${charGlow}` }} />
                    </div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{done.length} completed · {remaining.length} remaining</p>
                    <AnimatePresence>{pct === 100 && <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs mt-1.5 font-bold" style={{ color: charColor }}>Domain cleared — perfect day!</motion.p>}</AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 text-center py-2"><p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>No habits yet — add some to begin the curse</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
