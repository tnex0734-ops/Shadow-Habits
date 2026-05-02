import { useState, useEffect } from "react";
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
import { CheckCircle2, Circle, Zap, TrendingUp, Trophy, Swords, Flame, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

/* ─── Sorcerer Grade System ─── */
const getGrade = (pct: number) => {
  if (pct === 100) return { label: "SPECIAL GRADE", color: "#FFFFFF", rank: 7 };
  if (pct >= 85)   return { label: "SEMI-SPECIAL", color: "#AAFF00", rank: 6 };
  if (pct >= 70)   return { label: "GRADE 1", color: "#00E5FF", rank: 5 };
  if (pct >= 55)   return { label: "GRADE 2", color: "#FFA000", rank: 4 };
  if (pct >= 40)   return { label: "GRADE 3", color: "#FF6B00", rank: 3 };
  if (pct >= 20)   return { label: "GRADE 4", color: "#888", rank: 2 };
  return { label: "UNRANKED", color: "#555", rank: 1 };
};

/* ─── Flame icon with animation ─── */
function FlameIcon({ streak, color, size = 18 }: { streak: number; color: string; size?: number }) {
  if (streak === 0) return <Flame style={{ width: size, height: size, color: "rgba(255,255,255,0.2)" }} />;
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <Flame className="flame-icon" style={{ width: size, height: size, color, filter: `drop-shadow(0 0 5px ${color})` }} />
    </span>
  );
}

/* ─── Technique (Habit) Card ─── */
function TechniqueCard({ habit, compact = false }: {
  habit: { id: number; title: string; description?: string | null; completedDates: unknown; currentStreak: number };
  compact?: boolean;
}) {
  const queryClient = useQueryClient();
  const { charColor, charGlow } = useTheme();
  const today = getTodayStr();
  const completedDates = habit.completedDates as string[];
  const isCompleted = completedDates.includes(today);
  const [justCompleted, setJustCompleted] = useState(false);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetHabitsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetCompanionMessageQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetInsightsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetStreaksQueryKey() });
  };

  const completeMutation = useCompleteHabit({ mutation: { onSuccess: () => { setJustCompleted(true); setTimeout(() => setJustCompleted(false), 800); invalidate(); } } });
  const uncompleteMutation = useUncompleteHabit({ mutation: { onSuccess: invalidate } });
  const isPending = completeMutation.isPending || uncompleteMutation.isPending;

  const handleToggle = () => {
    if (isPending) return;
    if (isCompleted) {
      uncompleteMutation.mutate({ id: String(habit.id), data: { date: today } });
    } else {
      completeMutation.mutate({ id: String(habit.id), data: { date: today } });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("technique-card overflow-hidden", isCompleted && "mastered")}
      data-testid={`habit-card-${habit.id}`}
    >
      <div className={cn("flex items-center gap-3", compact ? "p-3" : "p-4")}>
        {/* Streak flame indicator */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <FlameIcon streak={habit.currentStreak} color={charColor} size={compact ? 16 : 20} />
          {habit.currentStreak > 0 && (
            <span className="text-xs font-bold" style={{ color: charColor, fontSize: 10 }}>{habit.currentStreak}</span>
          )}
        </div>

        {/* Technique name */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-semibold leading-tight",
            compact ? "text-sm" : "text-base",
            isCompleted ? "line-through opacity-50" : "text-white"
          )}>
            {habit.title}
          </p>
          {!compact && habit.description && (
            <p className="text-xs mt-0.5 opacity-50 truncate">{habit.description}</p>
          )}
          {!compact && (
            <div className="flex gap-1 mt-2">
              {Array.from({ length: 7 }, (_, i) => {
                const d = new Date(); d.setDate(d.getDate() - (6 - i));
                const done = (habit.completedDates as string[]).includes(formatDate(d));
                return (
                  <div key={i} className="flex-1 h-1 rounded-full transition-all" style={{ backgroundColor: done ? charColor : "rgba(255,255,255,0.08)", maxWidth: 16 }} />
                );
              })}
            </div>
          )}
        </div>

        {/* BIG completion button — Fitts's Law */}
        <motion.button
          onClick={handleToggle}
          disabled={isPending}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "flex-shrink-0 rounded-xl flex items-center justify-center transition-all disabled:opacity-50",
            compact ? "w-10 h-10" : "w-12 h-12",
            justCompleted ? "black-flash" : "",
          )}
          style={isCompleted
            ? { backgroundColor: `${charColor}22`, border: `2px solid ${charColor}`, boxShadow: `0 0 14px ${charGlow}` }
            : { backgroundColor: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.12)" }
          }
          data-testid={`toggle-habit-${habit.id}`}
        >
          <AnimatePresence mode="wait">
            {isPending ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
            ) : isCompleted ? (
              <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="check-pop">
                <CheckCircle2 className="w-5 h-5" style={{ color: charColor }} />
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                <Circle className="w-5 h-5 text-white/25" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── 14-day Combat Log strip ─── */
function CombatLog({ habits }: { habits: Array<{ completedDates: unknown }> }) {
  const { charColor } = useTheme();
  const today = getTodayStr();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i)); return d;
  });

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
      {days.map((d, i) => {
        const ds = formatDate(d);
        const isToday = ds === today;
        const total = habits.length;
        const done = habits.filter(h => (h.completedDates as string[]).includes(ds)).length;
        const ratio = total > 0 ? done / total : 0;

        return (
          <div key={i} className="flex flex-col items-center gap-1 min-w-[36px]">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontSize: 9 }}>
              {d.toLocaleDateString("en", { weekday: "narrow" })}
            </span>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
              style={isToday
                ? { border: `2px solid ${charColor}`, color: charColor, boxShadow: `0 0 10px ${charColor}50` }
                : ratio > 0
                  ? { backgroundColor: `${charColor}${Math.round(ratio * 40 + 15).toString(16).padStart(2, "0")}`, border: `1px solid ${charColor}30`, color: "rgba(255,255,255,0.8)" }
                  : { border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.2)" }
              }
            >
              {d.getDate()}
            </div>
            <div
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: ratio >= 1 ? charColor : ratio > 0 ? `${charColor}60` : "transparent" }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ─── Companion Widget ─── */
function CompanionWidget({ compact }: { compact?: boolean }) {
  const { charColor, charGlow, charGlowSoft, charImage, charName } = useTheme();
  const { data: companion } = useGetCompanionMessage();

  return (
    <div
      className="rounded-2xl p-4 border relative overflow-hidden"
      style={{ background: "rgba(6,18,6,0.7)", borderColor: `${charColor}20`, backdropFilter: "blur(20px)" }}
    >
      <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at 80% 0%, ${charGlowSoft}, transparent 65%)` }} />
      <div className="relative z-10">
        <div className="flex gap-3 items-start">
          <div
            className="w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0"
            style={{ borderColor: charColor, boxShadow: `0 0 18px ${charGlow}` }}
          >
            <img src={charImage} alt={charName} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="grade-badge" style={{ backgroundColor: charColor }}>{charName.toUpperCase()}</span>
              {companion && <span className="text-xs capitalize" style={{ color: "rgba(255,255,255,0.35)" }}>{companion.mood}</span>}
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              {companion?.message || "Awakening cursed energy..."}
            </p>
          </div>
        </div>
        {companion && (
          <div className="mt-3">
            <div className="cursed-bar-track h-1.5">
              <motion.div
                className="cursed-bar-fill h-1.5"
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(companion.completionRate * 100)}%` }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Cursed Energy Output</span>
              <span className="text-xs font-bold" style={{ color: charColor }}>{Math.round(companion.completionRate * 100)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN DASHBOARD ─── */
export default function DashboardPage() {
  const { user } = useAuth();
  const { charColor, charGlow, charGlowSoft } = useTheme();
  const { data: habits = [] } = useGetHabits();
  const { data: summary } = useGetDashboardSummary();
  const { data: insights } = useGetInsights();

  const today = new Date();
  const todayStr = getTodayStr();
  const todayDisplay = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const completedToday = habits.filter(h => (h.completedDates as string[]).includes(todayStr));
  const incompleteToday = habits.filter(h => !(h.completedDates as string[]).includes(todayStr));
  const total = habits.length;
  const pct = total > 0 ? Math.round((completedToday.length / total) * 100) : 0;
  const grade = getGrade(pct);
  const isDomainExpanded = pct === 100 && total > 0;

  /* Streak-at-risk: any incomplete habit with an active streak */
  const streakAtRisk = incompleteToday.filter(h => (h as { currentStreak?: number }).currentStreak! > 0);

  return (
    <div className="space-y-5">

      {/* ── BATTLEFIELD HEADER ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Swords className="w-4 h-4" style={{ color: charColor }} />
            <p className="font-display text-xs tracking-widest uppercase" style={{ color: `${charColor}80` }}>
              THE BATTLEFIELD
            </p>
          </div>
          <h1 className="text-2xl font-bold leading-tight">
            <span style={{ color: charColor, textShadow: `0 0 20px ${charGlow}` }}>{user?.name?.split(" ")[0]}</span>
            <span className="text-white/80 font-normal text-lg">'s domain</span>
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{todayDisplay}</p>
        </div>

        {/* Grade badge */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <div
            className="px-3 py-1.5 rounded-xl border font-display text-sm tracking-widest"
            style={{
              borderColor: `${grade.color}40`,
              backgroundColor: `${grade.color}12`,
              color: grade.color,
              boxShadow: isDomainExpanded ? `0 0 24px ${charGlow}` : undefined,
            }}
          >
            {isDomainExpanded ? "✦ DOMAIN EXPANDED ✦" : grade.label}
          </div>
          {summary?.longestStreak! > 0 && (
            <div className="flex items-center gap-1">
              <Trophy className="w-3 h-3" style={{ color: "rgba(255,255,255,0.4)" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Best streak: {summary?.longestStreak}d</span>
            </div>
          )}
        </div>
      </div>

      {/* ── CURSED ENERGY BAR (Goal Gradient) ── */}
      {total > 0 && (
        <div
          className="rounded-2xl p-4 border"
          style={{ background: "rgba(6,18,6,0.65)", borderColor: `${charColor}18`, backdropFilter: "blur(16px)" }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" style={{ color: charColor }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: `${charColor}90` }}>
                Cursed Energy Reserve
              </span>
            </div>
            <span className="font-display text-lg" style={{ color: charColor }}>
              {completedToday.length}<span className="text-white/30 text-sm">/{total}</span>
            </span>
          </div>
          <div className="cursed-bar-track h-3">
            <motion.div
              className="cursed-bar-fill h-3"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              {pct === 0 ? "Begin your techniques" : pct < 50 ? "Keep channeling..." : pct < 100 ? "Almost at full output!" : "✦ Domain Expanded — Mastered today!"}
            </span>
            <span className="text-xs font-bold" style={{ color: charColor }}>{pct}%</span>
          </div>
        </div>
      )}

      {/* ── LOSS AVERSION: Streak at risk ── */}
      <AnimatePresence>
        {streakAtRisk.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl px-4 py-3 border flex items-center gap-3"
            style={{ backgroundColor: "rgba(255,100,0,0.08)", borderColor: "rgba(255,100,0,0.25)" }}
          >
            <span className="flame-icon text-base">🔥</span>
            <p className="text-sm" style={{ color: "#FFA050" }}>
              <strong>{streakAtRisk.length} technique{streakAtRisk.length > 1 ? "s" : ""}</strong> {streakAtRisk.length > 1 ? "have active streaks at risk!" : `has a ${(streakAtRisk[0] as { currentStreak?: number }).currentStreak}-day streak at risk!`}{" "}
              Don't break the chain.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 2-COLUMN LAYOUT (wide screens) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

        {/* LEFT: Techniques */}
        <div className="space-y-4">

          {/* Incomplete techniques — Zeigarnik Effect (prominent) */}
          {incompleteToday.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="font-display text-sm tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Unmastered Techniques
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: `${charColor}18`, color: charColor }}>
                  {incompleteToday.length} remaining
                </span>
              </div>
              <div className="space-y-2">
                {incompleteToday.map(h => (
                  <TechniqueCard key={h.id} habit={h} />
                ))}
              </div>
            </div>
          )}

          {/* Completed techniques */}
          {completedToday.length > 0 && (
            <div>
              <h2 className="font-display text-sm tracking-widest uppercase mb-2.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                Mastered Today ✓
              </h2>
              <div className="space-y-2">
                {completedToday.map(h => (
                  <TechniqueCard key={h.id} habit={h} compact />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {habits.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl p-10 border border-dashed flex flex-col items-center gap-4 text-center"
              style={{ borderColor: `${charColor}25` }}
            >
              <Swords className="w-10 h-10" style={{ color: `${charColor}40` }} />
              <div>
                <p className="font-display text-lg tracking-widest uppercase" style={{ color: `${charColor}60` }}>No Techniques Yet</p>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Register your first cursed technique to begin training</p>
              </div>
              <Link href="/habits">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider"
                  style={{ backgroundColor: charColor, color: "#000", boxShadow: `0 0 20px ${charGlow}` }}
                >
                  <Plus className="w-4 h-4" /> Add Technique
                </motion.button>
              </Link>
            </motion.div>
          )}

          {/* Insights — Cursed Spirit Intel */}
          {insights && insights.length > 0 && (
            <div>
              <h2 className="font-display text-sm tracking-widest uppercase mb-2.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                Cursed Spirit Intel
              </h2>
              <div className="space-y-2">
                {insights.map((ins, i) => (
                  <motion.div
                    key={ins.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl px-4 py-3 border flex items-start gap-3 text-sm"
                    style={{ backgroundColor: `${charColor}07`, borderColor: `${charColor}18`, color: "rgba(255,255,255,0.7)" }}
                  >
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: charColor }} />
                    {ins.message}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Companion + Stats + Calendar */}
        <div className="space-y-4">

          {/* Companion */}
          <CompanionWidget />

          {/* Quick stats row */}
          {summary && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Techniques", value: summary.totalHabits, icon: Swords },
                { label: "Done Today", value: summary.completedToday, icon: CheckCircle2 },
                { label: "All-Time", value: summary.totalCompletions, icon: TrendingUp },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl p-3 border text-center"
                  style={{ background: "rgba(6,18,6,0.65)", borderColor: `${charColor}15`, backdropFilter: "blur(16px)" }}
                >
                  <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: charColor }} />
                  <p className="font-display text-xl" style={{ color: charColor }}>{value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)", fontSize: 9 }}>{label.toUpperCase()}</p>
                </div>
              ))}
            </div>
          )}

          {/* Combat Log (calendar) */}
          <div
            className="rounded-2xl p-4 border"
            style={{ background: "rgba(6,18,6,0.65)", borderColor: `${charColor}15`, backdropFilter: "blur(16px)" }}
          >
            <h2 className="font-display text-xs tracking-widest uppercase mb-3" style={{ color: `${charColor}70` }}>
              Combat Log — 14 Days
            </h2>
            <CombatLog habits={habits} />
          </div>

          {/* Navigation shortcut */}
          <Link href="/habits">
            <motion.div
              whileHover={{ scale: 1.01, borderColor: `${charColor}40` }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl p-3.5 border flex items-center justify-between cursor-pointer transition-all"
              style={{ background: "rgba(6,18,6,0.5)", borderColor: `${charColor}18` }}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4" style={{ color: charColor }} />
                <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>Manage Techniques</span>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: `${charColor}60` }} />
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
