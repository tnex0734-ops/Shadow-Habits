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
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getTodayStr, formatDate } from "@/lib/utils";
import { CheckCircle2, Circle, Flame, Plus, Swords } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

/* ─── Compact Habit Row ─── */
function HabitRow({ habit }: {
  habit: { id: number; title: string; completedDates: unknown; currentStreak: number };
}) {
  const queryClient = useQueryClient();
  const { charColor, charGlow } = useTheme();
  const today = getTodayStr();
  const completedDates = habit.completedDates as string[];
  const isCompleted = completedDates.includes(today);
  const [flash, setFlash] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetHabitsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetCompanionMessageQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetInsightsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetStreaksQueryKey() });
  };

  const completeMutation = useCompleteHabit({
    mutation: { onSuccess: () => { setFlash(true); setTimeout(() => setFlash(false), 600); invalidate(); } },
  });
  const uncompleteMutation = useUncompleteHabit({ mutation: { onSuccess: invalidate } });

  const toggle = () => {
    if (completeMutation.isPending || uncompleteMutation.isPending) return;
    isCompleted
      ? uncompleteMutation.mutate({ id: String(habit.id), data: { date: today } })
      : completeMutation.mutate({ id: String(habit.id), data: { date: today } });
  };

  return (
    <motion.div
      layout
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all",
        flash && "black-flash",
        isCompleted
          ? "opacity-60"
          : "hover:border-white/15",
      )}
      style={{
        background: isCompleted ? `${charColor}08` : "rgba(255,255,255,0.03)",
        borderColor: isCompleted ? `${charColor}25` : "rgba(255,255,255,0.08)",
      }}
      data-testid={`habit-card-${habit.id}`}
    >
      {/* Toggle — big tap target */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.85 }}
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
        style={isCompleted
          ? { backgroundColor: `${charColor}20`, border: `1.5px solid ${charColor}`, boxShadow: `0 0 10px ${charColor}50` }
          : { backgroundColor: "transparent", border: "1.5px solid rgba(255,255,255,0.15)" }
        }
        data-testid={`toggle-habit-${habit.id}`}
      >
        <AnimatePresence mode="wait">
          {isCompleted
            ? <motion.div key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} className="check-pop"><CheckCircle2 className="w-4 h-4" style={{ color: charColor }} /></motion.div>
            : <motion.div key="e" initial={{ scale: 0.8 }} animate={{ scale: 1 }}><Circle className="w-4 h-4 text-white/25" /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Name */}
      <span className={cn("flex-1 text-sm font-medium leading-tight", isCompleted ? "line-through text-white/40" : "text-white/85")}>
        {habit.title}
      </span>

      {/* Streak */}
      {habit.currentStreak > 0 && (
        <div className="flex items-center gap-1 flex-shrink-0">
          <Flame className="w-3 h-3 flame-icon" style={{ color: charColor }} />
          <span className="text-xs font-bold" style={{ color: charColor }}>{habit.currentStreak}</span>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Custom bar tooltip ─── */
function ChartTip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  const { charColor } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <div className="px-2 py-1.5 rounded-lg text-xs border" style={{ background: "rgba(4,12,22,0.95)", borderColor: `${charColor}30` }}>
      <p style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
      <p className="font-bold" style={{ color: charColor }}>{payload[0].value} done</p>
    </div>
  );
}

/* ═══ MAIN DASHBOARD ═══ */
export default function DashboardPage() {
  const { user } = useAuth();
  const { charColor, charGlow, charGlowSoft } = useTheme();
  const { data: habits = [] } = useGetHabits();
  const { data: summary } = useGetDashboardSummary();
  const { data: companion } = useGetCompanionMessage();

  const today = getTodayStr();
  const todayDisplay = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const done = habits.filter(h => (h.completedDates as string[]).includes(today));
  const remaining = habits.filter(h => !(h.completedDates as string[]).includes(today));
  const total = habits.length;
  const pct = total > 0 ? Math.round((done.length / total) * 100) : 0;

  /* Build 7-day chart data */
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const ds = formatDate(d);
    return {
      day: d.toLocaleDateString("en", { weekday: "narrow" }),
      completed: habits.filter(h => (h.completedDates as string[]).includes(ds)).length,
      isToday: ds === today,
    };
  });

  /* Streak at risk */
  const streakAtRisk = remaining.filter(h => (h as { currentStreak?: number }).currentStreak! > 0);

  return (
    <div className="h-full max-w-7xl mx-auto px-5 py-4 flex flex-col gap-4">

      {/* ── TOP ROW: greeting + date + progress ── */}
      <div className="flex items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">
            Hey, <span style={{ color: charColor }}>{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{todayDisplay}</p>
        </div>

        {/* Compact progress pill */}
        {total > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl border flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)", borderColor: `${charColor}20` }}>
            <div className="text-right">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Today</p>
              <p className="text-sm font-bold" style={{ color: charColor }}>{done.length}/{total} done</p>
            </div>
            {/* Mini radial */}
            <div className="relative w-10 h-10 flex-shrink-0">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="14" fill="none"
                  stroke={charColor} strokeWidth="3"
                  strokeDasharray={`${pct * 0.88} 88`}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 4px ${charGlow})`, transition: "stroke-dasharray 0.8s ease" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: charColor }}>{pct}%</span>
            </div>
          </div>
        )}
      </div>

      {/* ── MAIN GRID ── */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

        {/* LEFT: Habits list */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* Streak warning */}
          <AnimatePresence>
            {streakAtRisk.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border flex-shrink-0 text-sm"
                style={{ backgroundColor: "rgba(255,140,0,0.08)", borderColor: "rgba(255,140,0,0.22)", color: "#FFAA40" }}
              >
                <Flame className="w-3.5 h-3.5 flame-icon flex-shrink-0" style={{ color: "#FFA000" }} />
                {streakAtRisk.length === 1
                  ? `"${streakAtRisk[0].title}" streak will reset today`
                  : `${streakAtRisk.length} habit streaks will reset if not done today`
                }
              </motion.div>
            )}
          </AnimatePresence>

          {/* Remaining habits */}
          {remaining.length > 0 && (
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Habits — {remaining.length} left
                </p>
                <Link href="/habits">
                  <span className="text-xs" style={{ color: `${charColor}70` }}>+ Add</span>
                </Link>
              </div>
              <div className="space-y-1.5">
                {remaining.map(h => <HabitRow key={h.id} habit={h} />)}
              </div>
            </div>
          )}

          {/* Completed */}
          {done.length > 0 && (
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                Done today ✓
              </p>
              <div className="space-y-1.5">
                {done.map(h => <HabitRow key={h.id} habit={h} />)}
              </div>
            </div>
          )}

          {/* Empty state */}
          {habits.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
              <Swords className="w-10 h-10" style={{ color: `${charColor}30` }} />
              <div>
                <p className="font-semibold text-white/60">No habits yet</p>
                <p className="text-sm text-white/35 mt-0.5">Add your first habit to start tracking</p>
              </div>
              <Link href="/habits">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm"
                  style={{ backgroundColor: charColor, color: "#000", boxShadow: `0 0 16px ${charGlow}` }}
                >
                  <Plus className="w-4 h-4" /> Add Habit
                </motion.button>
              </Link>
            </div>
          )}

          {/* Progress bar */}
          {total > 0 && (
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {pct === 0 ? "Start your day" : pct < 100 ? `${done.length} of ${total} complete` : "All done! Great work 🎉"}
                </p>
                <p className="text-xs font-bold" style={{ color: charColor }}>{pct}%</p>
              </div>
              <div className="cursed-bar-track h-2">
                <motion.div
                  className="cursed-bar-fill h-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Companion + Chart + Stats */}
        <div className="flex flex-col gap-3 min-h-0">

          {/* Companion */}
          <div
            className="rounded-2xl p-3.5 border flex-shrink-0"
            style={{ background: "rgba(4,12,22,0.7)", borderColor: `${charColor}20`, backdropFilter: "blur(20px)" }}
          >
            <div className="flex gap-3 items-start">
              <div
                className="w-12 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0"
                style={{ borderColor: charColor, boxShadow: `0 0 14px ${charGlow}` }}
              >
                {companion && <img src={`/src/assets/character-${companion.character?.replace("infinity-mentor", "infinity").replace("dark-king", "dark").replace("energy-hero", "energy")}.png`} alt="companion" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold mb-1" style={{ color: charColor }}>
                  {companion?.character === "infinity-mentor" ? "Infinity Mentor" : companion?.character === "dark-king" ? "Dark King" : "Energy Hero"}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {companion?.message || "Keep pushing forward."}
                </p>
              </div>
            </div>
          </div>

          {/* 7-day bar chart */}
          <div
            className="rounded-2xl p-3.5 border flex-shrink-0"
            style={{ background: "rgba(4,12,22,0.7)", borderColor: `${charColor}15`, backdropFilter: "blur(20px)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
              Last 7 Days
            </p>
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={chartData} barSize={18} margin={{ top: 0, right: 0, bottom: 0, left: -28 }}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 9, fill: "rgba(255,255,255,0.35)" }}
                  axisLine={false} tickLine={false}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "rgba(255,255,255,0.25)" }} allowDecimals={false} />
                <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.isToday ? charColor : `${charColor}55`}
                      style={entry.isToday ? { filter: `drop-shadow(0 0 6px ${charGlow})` } : undefined}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick stats */}
          {summary && (
            <div className="grid grid-cols-3 gap-2 flex-shrink-0">
              {[
                { label: "Streak", value: summary.longestStreak ?? 0, suffix: "d" },
                { label: "Total", value: summary.totalHabits ?? 0, suffix: "" },
                { label: "All-time", value: summary.totalCompletions ?? 0, suffix: "" },
              ].map(({ label, value, suffix }) => (
                <div
                  key={label}
                  className="rounded-xl p-2.5 border text-center"
                  style={{ background: "rgba(4,12,22,0.65)", borderColor: `${charColor}12` }}
                >
                  <p className="text-lg font-bold leading-tight" style={{ color: charColor }}>{value}{suffix}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>{label.toUpperCase()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
