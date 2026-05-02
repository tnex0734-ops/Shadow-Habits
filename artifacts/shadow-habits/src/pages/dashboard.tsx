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

/* ─── Habit Row ─── */
function HabitRow({ habit }: {
  habit: { id: number; title: string; completedDates: unknown; currentStreak: number };
}) {
  const queryClient = useQueryClient();
  const { charColor, charGlow } = useTheme();
  const today = getTodayStr();
  const isCompleted = (habit.completedDates as string[]).includes(today);
  const [flash, setFlash] = useState(false);

  const inv = () => {
    [getGetHabitsQueryKey, getGetDashboardSummaryQueryKey, getGetCompanionMessageQueryKey, getGetInsightsQueryKey, getGetStreaksQueryKey].forEach(k =>
      queryClient.invalidateQueries({ queryKey: k() })
    );
  };

  const completeMutation = useCompleteHabit({ mutation: { onSuccess: () => { setFlash(true); setTimeout(() => setFlash(false), 500); inv(); } } });
  const uncompleteMutation = useUncompleteHabit({ mutation: { onSuccess: inv } });
  const busy = completeMutation.isPending || uncompleteMutation.isPending;

  const toggle = () => {
    if (busy) return;
    isCompleted
      ? uncompleteMutation.mutate({ id: String(habit.id), data: { date: today } })
      : completeMutation.mutate({ id: String(habit.id), data: { date: today } });
  };

  return (
    <motion.div
      layout
      className={cn("flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all relative overflow-hidden", flash && "black-flash")}
      style={{
        background: isCompleted
          ? `linear-gradient(135deg, ${charColor}0d 0%, rgba(255,255,255,0.02) 100%)`
          : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${isCompleted ? charColor + "22" : "rgba(255,255,255,0.06)"}`,
        boxShadow: isCompleted
          ? `0 4px 20px ${charColor}0e, inset 0 1px 0 rgba(255,255,255,0.06)`
          : "0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      data-testid={`habit-card-${habit.id}`}
    >
      {/* Animated glass checkbox */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.88 }}
        disabled={busy}
        className="w-8 h-8 rounded-xl flex-shrink-0 relative overflow-hidden disabled:opacity-40"
        style={isCompleted
          ? { background: `${charColor}20`, boxShadow: `0 0 16px ${charColor}40, inset 0 1px 0 rgba(255,255,255,0.1)`, border: `1.5px solid ${charColor}60` }
          : { background: "rgba(255,255,255,0.04)", border: "1.5px dashed rgba(255,255,255,0.18)" }
        }
        data-testid={`toggle-habit-${habit.id}`}
      >
        <AnimatePresence>
          {isCompleted && (
            <motion.svg
              key="check"
              viewBox="0 0 18 18"
              className="w-4 h-4 absolute inset-0 m-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.path
                d="M4 9 L7.5 12.5 L14 6"
                stroke={charColor}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Title */}
      <span
        className="flex-1 text-sm font-medium leading-snug tracking-wide"
        style={{ color: isCompleted ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.88)", textDecoration: isCompleted ? "line-through" : "none" }}
      >
        {habit.title}
      </span>

      {/* Streak badge — no icon, just a glowing number */}
      {habit.currentStreak > 0 && (
        <span
          className="text-xs font-bold flex-shrink-0 tabular-nums"
          style={{ color: charColor, textShadow: `0 0 10px ${charGlow}`, letterSpacing: "0.04em" }}
        >
          {habit.currentStreak}d
        </span>
      )}
    </motion.div>
  );
}

/* ─── Chart tooltip ─── */
function ChartTip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  const { charColor } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl text-xs border" style={{ background: "rgba(4,12,22,0.96)", borderColor: `${charColor}30`, backdropFilter: "blur(12px)" }}>
      <p style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
      <p className="font-bold mt-0.5" style={{ color: charColor }}>{payload[0].value} completed</p>
    </div>
  );
}

/* ═══ DASHBOARD ═══ */
export default function DashboardPage() {
  const { charColor, charGlow, charGlowSoft } = useTheme();
  const { data: habits = [] } = useGetHabits();
  const { data: summary } = useGetDashboardSummary();
  const { data: companion } = useGetCompanionMessage();

  const today = getTodayStr();

  const done = habits.filter(h => (h.completedDates as string[]).includes(today));
  const remaining = habits.filter(h => !(h.completedDates as string[]).includes(today));
  const total = habits.length;
  const pct = total > 0 ? Math.round((done.length / total) * 100) : 0;
  const streakAtRisk = remaining.filter(h => (h as { currentStreak?: number }).currentStreak! > 0);

  /* Last 7 days chart */
  const chart7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return {
      day: d.toLocaleDateString("en", { weekday: "narrow" }),
      count: habits.filter(h => (h.completedDates as string[]).includes(formatDate(d))).length,
      isToday: formatDate(d) === today,
    };
  });

  /* Character image path helper */
  const charImgMap: Record<string, string> = {
    "infinity-mentor": "/src/assets/character-infinity.png",
    "dark-king":       "/src/assets/character-dark.png",
    "energy-hero":     "/src/assets/character-energy.png",
    "shadow-bearer":   "/src/assets/character-megumi.svg",
    "straw-doll":      "/src/assets/character-nobara.svg",
    "ratio-master":    "/src/assets/character-nanami.svg",
    "iron-body":       "/src/assets/character-maki.svg",
    "cursed-voice":    "/src/assets/character-inumaki.svg",
    "best-friend":     "/src/assets/character-todo.svg",
  };
  const charNameMap: Record<string, string> = {
    "infinity-mentor": "Infinity Mentor",
    "dark-king":       "Dark King",
    "energy-hero":     "Energy Hero",
    "shadow-bearer":   "Shadow Bearer",
    "straw-doll":      "Straw Doll",
    "ratio-master":    "Ratio Master",
    "iron-body":       "Iron Body",
    "cursed-voice":    "Cursed Voice",
    "best-friend":     "Best Friend",
  };
  const companionImg = charImgMap[companion?.character ?? ""] ?? "/src/assets/character-infinity.png";
  const companionName = charNameMap[companion?.character ?? ""] ?? "Infinity Mentor";
  const gradId = `cg-${charColor.replace("#", "")}`;

  return (
    <div className="h-full flex flex-col px-6 pt-5 pb-3 gap-4 overflow-hidden max-w-5xl mx-auto w-full">

      {/* ── STREAK WARNING ── */}
      <AnimatePresence>
        {streakAtRisk.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm"
            style={{ backgroundColor: "rgba(255,130,0,0.07)", borderColor: "rgba(255,130,0,0.2)", color: "#FFAA55" }}
          >
            <Flame className="w-4 h-4 flame-icon flex-shrink-0" style={{ color: "#FFA000" }} />
            <span>
              {streakAtRisk.length === 1
                ? `"${streakAtRisk[0].title}" streak will reset if not completed today`
                : `${streakAtRisk.length} habit streaks at risk — complete them today`}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN 2-COLUMN GRID ── */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

        {/* LEFT: Progress + Stats + Habits */}
        <div className="flex flex-col gap-3 min-h-0 overflow-hidden">

          {/* ── Glass progress card ── */}
          {total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="flex-shrink-0 rounded-2xl p-4 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(24px)",
                border: `1px solid rgba(255,255,255,0.08)`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 1px ${charColor}0a`,
              }}
            >
              {/* Subtle color wash */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 10% 50%, ${charColor}0a, transparent 60%)` }} />

              <div className="relative flex items-center gap-5">
                {/* Conic progress ring */}
                <div className="flex-shrink-0 relative" style={{ width: 72, height: 72 }}>
                  <div
                    className="w-full h-full rounded-full"
                    style={{
                      background: `conic-gradient(${charColor} ${pct * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                      padding: 3,
                    }}
                  >
                    <div
                      className="w-full h-full rounded-full flex flex-col items-center justify-center"
                      style={{ background: "#060d14" }}
                    >
                      <span className="text-base font-bold leading-none" style={{ color: charColor }}>{done.length}/{total}</span>
                      <span className="text-[8px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>done</span>
                    </div>
                  </div>
                  {/* Glow under ring */}
                  <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: `0 0 20px ${charColor}25` }} />
                </div>

                {/* Right side: label + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Today's Progress
                    </span>
                    <span className="text-xs font-bold" style={{ color: charColor }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      style={{ background: `linear-gradient(90deg, ${charColor}99, ${charColor})`, boxShadow: `0 0 10px ${charGlow}` }}
                    />
                  </div>
                  <AnimatePresence>
                    {pct === 100 && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-xs mt-2 font-semibold"
                        style={{ color: charColor }}
                      >
                        All done — great work! 🎉
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Unified glass stat strip ── */}
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
              className="flex-shrink-0 flex items-stretch rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.035)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {[
                { label: "Best Streak", value: `${summary.longestStreak ?? 0}d` },
                { label: "Habits",      value: summary.totalHabits ?? 0 },
                { label: "All-Time",    value: summary.totalCompletions ?? 0 },
              ].map(({ label, value }, i) => (
                <div key={label} className="flex-1 flex flex-col items-center justify-center py-3 relative">
                  {i > 0 && (
                    <div className="absolute left-0 top-2 bottom-2 w-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                  )}
                  <span className="text-base font-bold leading-none" style={{ color: charColor }}>{value}</span>
                  <span className="text-[9px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* ── Habit list ── */}
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-1.5 pr-0.5">
            {remaining.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest px-1 pb-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Up next — {remaining.length}
                </p>
                {remaining.map(h => <HabitRow key={h.id} habit={h} />)}
              </div>
            )}

            {done.length > 0 && (
              <div className="space-y-1.5 mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest px-1 pb-1" style={{ color: "rgba(255,255,255,0.16)" }}>
                  Completed — {done.length}
                </p>
                {done.map(h => <HabitRow key={h.id} habit={h} />)}
              </div>
            )}

            {habits.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 pt-10 text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(12px)",
                    border: `1px solid ${charColor}20`,
                    boxShadow: `0 0 24px ${charColor}10`,
                  }}
                >
                  <Plus className="w-7 h-7" style={{ color: `${charColor}60` }} />
                </div>
                <div>
                  <p className="font-semibold text-white/50 text-base">No habits yet</p>
                  <p className="text-sm text-white/25 mt-1">Add your first daily habit to begin</p>
                </div>
                <Link href="/habits">
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="px-6 py-3 rounded-2xl font-bold text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${charColor}dd, ${charColor})`,
                      color: "#000",
                      boxShadow: `0 0 24px ${charGlow}, 0 4px 16px rgba(0,0,0,0.3)`,
                    }}
                  >
                    Add your first habit
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Companion + Chart + Stats */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* Companion card */}
          <div
            className="flex-shrink-0 rounded-2xl p-4 border overflow-hidden relative"
            style={{
              background: "rgba(4,12,22,0.75)",
              borderColor: `${charColor}22`,
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at 80% 0%, ${charGlowSoft}, transparent 65%)` }} />
            <div className="relative flex gap-3 items-center">
              <div
                className="w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0"
                style={{ borderColor: charColor, boxShadow: `0 0 18px ${charGlow}` }}
              >
                <img src={companionImg} alt="companion" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: charColor }}>
                  {companionName}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {companion?.message || "Keep going."}
                </p>
              </div>
            </div>
          </div>

          {/* 7-day chart */}
          <div
            className="flex-1 min-h-0 rounded-2xl p-4 border flex flex-col"
            style={{ background: "rgba(4,12,22,0.75)", borderColor: `${charColor}15`, backdropFilter: "blur(24px)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>
              Last 7 Days
            </p>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart7} margin={{ top: 24, right: 8, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={charColor} stopOpacity={0.5} />
                      <stop offset="75%" stopColor={charColor} stopOpacity={0.08} />
                      <stop offset="100%" stopColor={charColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 9, fill: "rgba(255,255,255,0.2)" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    width={20}
                  />
                  <Tooltip content={<ChartTip />} cursor={{ stroke: `${charColor}25`, strokeWidth: 1 }} />
                  <Area
                    type="monotoneX"
                    dataKey="count"
                    stroke={charColor}
                    strokeWidth={2.5}
                    fill={`url(#${gradId})`}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                    dot={(props: { cx: number; cy: number; payload: { isToday: boolean } }) => {
                      const { cx, cy, payload } = props;
                      if (payload.isToday) {
                        const r = 13;
                        return (
                          <g key={`today-${cx}`}>
                            {/* Outer pulse ring */}
                            <circle cx={cx} cy={cy} r={r + 4} fill={charColor} fillOpacity={0.12}>
                              <animate attributeName="r" values={`${r + 2};${r + 7};${r + 2}`} dur="2.4s" repeatCount="indefinite" />
                              <animate attributeName="fill-opacity" values="0.15;0.04;0.15" dur="2.4s" repeatCount="indefinite" />
                            </circle>
                            {/* Inner border ring */}
                            <circle cx={cx} cy={cy} r={r} fill="#040c16" stroke={charColor} strokeWidth={2}
                              style={{ filter: `drop-shadow(0 0 8px ${charGlow})` }} />
                            {/* Clip circle for avatar */}
                            <clipPath id={`ac-${cx}`}>
                              <circle cx={cx} cy={cy} r={r - 2} />
                            </clipPath>
                            {/* Character avatar */}
                            <image
                              href={companionImg}
                              x={cx - (r - 2)} y={cy - (r - 2)}
                              width={(r - 2) * 2} height={(r - 2) * 2}
                              clipPath={`url(#ac-${cx})`}
                              preserveAspectRatio="xMidYMid slice"
                            />
                          </g>
                        );
                      }
                      return (
                        <circle key={`dot-${cx}`} cx={cx} cy={cy} r={3} fill={charColor} fillOpacity={0.55} />
                      );
                    }}
                    activeDot={{ r: 5, fill: charColor, stroke: "rgba(0,0,0,0.5)", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
