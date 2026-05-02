import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetHabits,
  getGetHabitsQueryKey,
  useCompleteHabit,
  useUncompleteHabit,
  useGetDashboardSummary,
  getGetDashboardSummaryQueryKey,
  useGetCompanionMessage,
  getGetCompanionMessageQueryKey,
  useGetInsights,
  getGetInsightsQueryKey,
  useGetStreaks,
  getGetStreaksQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getTodayStr, formatDate } from "@/lib/utils";
import { Flame, CheckCircle2, Circle, Zap, TrendingUp, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

function CalendarStrip() {
  const { charColor, charGlow } = useTheme();
  const habits = useGetHabits();
  const today = getTodayStr();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d;
  });

  const allDates = (habits || []).flatMap((h) => h.completedDates as string[]);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      {days.map((d, i) => {
        const dateStr = formatDate(d);
        const isToday = dateStr === today;
        const totalHabits = (habits || []).length;
        const completed = allDates.filter((x) => x === dateStr).length / Math.max(totalHabits, 1);
        const hasAny = allDates.some((x) => x === dateStr);

        return (
          <div
            key={i}
            className="flex flex-col items-center gap-1.5 min-w-[48px]"
            data-testid={`calendar-day-${dateStr}`}
          >
            <span className="text-xs text-muted-foreground">{d.toLocaleDateString("en-US", { weekday: "short" })}</span>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-sm transition-all border"
              style={
                isToday
                  ? { borderColor: charColor, boxShadow: `0 0 12px ${charGlow}`, color: charColor }
                  : hasAny
                  ? { borderColor: `${charColor}50`, backgroundColor: `${charColor}20`, color: "#fff" }
                  : { borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }
              }
            >
              {d.getDate()}
            </div>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hasAny ? charColor : "transparent" }} />
          </div>
        );
      })}
    </div>
  );
}

function CompanionWidget() {
  const { charColor, charGlow, charImage, charName } = useTheme();
  const companion = useGetCompanionMessage();

  const moodColors = {
    celebrating: charColor,
    encouraging: charColor,
    challenging: "#f59e0b",
    disappointed: "#94a3b8",
    neutral: charColor,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{ background: `radial-gradient(ellipse at 70% 50%, ${charColor}, transparent 70%)` }}
      />
      <div className="flex gap-4 items-start relative z-10">
        <div
          className="w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0"
          style={{ borderColor: charColor, boxShadow: `0 0 20px ${charGlow}` }}
        >
          <img src={charImage} alt={charName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${charColor}25`, color: charColor }}>
              {charName}
            </span>
            {companion && (
              <span className="text-xs text-muted-foreground capitalize">{companion.mood}</span>
            )}
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {companion?.message || "Loading your companion message..."}
          </p>
          {companion && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round(companion.completionRate * 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: charColor }}
                />
              </div>
              <span className="text-xs font-bold" style={{ color: charColor }}>
                {Math.round(companion.completionRate * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function HabitCard({ habit }: { habit: { id: number; title: string; completedDates: string[]; currentStreak: number } }) {
  const queryClient = useQueryClient();
  const { charColor, charGlow } = useTheme();
  const today = getTodayStr();
  const isCompleted = (habit.completedDates as string[]).includes(today);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetHabitsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetCompanionMessageQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetInsightsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetStreaksQueryKey() });
  };

  const completeMutation = useCompleteHabit({ mutation: { onSuccess: invalidate } });
  const uncompleteMutation = useUncompleteHabit({ mutation: { onSuccess: invalidate } });

  const handleToggle = () => {
    if (isCompleted) {
      uncompleteMutation.mutate({ id: String(habit.id), data: { date: today } });
    } else {
      completeMutation.mutate({ id: String(habit.id), data: { date: today } });
    }
  };

  const isPending = completeMutation.isPending || uncompleteMutation.isPending;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "glass-card rounded-xl p-4 border cursor-pointer transition-all select-none",
        isCompleted ? "border-primary/40" : "border-white/8 hover:border-white/15"
      )}
      style={isCompleted ? { boxShadow: `0 0 12px ${charGlow}` } : {}}
      onClick={handleToggle}
      data-testid={`habit-card-${habit.id}`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={isCompleted ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-6 h-6" style={{ color: charColor, filter: `drop-shadow(0 0 6px ${charGlow})` }} />
          ) : (
            <Circle className="w-6 h-6 text-muted-foreground" />
          )}
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className={cn("text-sm font-medium truncate", isCompleted ? "line-through opacity-60" : "text-foreground")}>
            {habit.title}
          </p>
          {habit.currentStreak > 0 && (
            <div className="flex items-center gap-1 mt-0.5">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="text-xs text-muted-foreground">{habit.currentStreak} day streak</span>
            </div>
          )}
        </div>
        {isPending && <div className="w-4 h-4 border-2 rounded-full border-primary/40 border-t-primary animate-spin" />}
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { charColor, charGlow } = useTheme();
  const habits = useGetHabits();
  const summary = useGetDashboardSummary();
  const insights = useGetInsights();

  const today = new Date();
  const todayDisplay = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const completionPct = summary ? Math.round(summary.completionRate * 100) : 0;
  const statusLabel =
    completionPct === 100 ? "Domain Expanded" :
    completionPct >= 75 ? "Thriving" :
    completionPct >= 50 ? "Advancing" :
    completionPct >= 25 ? "Awakening" : "Dormant";

  const incompleteToday = (habits || []).filter(
    (h) => !(h.completedDates as string[]).includes(getTodayStr())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-muted-foreground text-sm">{todayDisplay}</p>
        <h1 className="text-2xl font-bold mt-0.5">
          Welcome back, <span style={{ color: charColor, textShadow: `0 0 20px ${charGlow}` }}>{user?.name?.split(" ")[0]}</span>
        </h1>
        {summary && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium px-3 py-1 rounded-full border" style={{ borderColor: `${charColor}40`, backgroundColor: `${charColor}15`, color: charColor }}>
              {statusLabel} — {completionPct}%
            </span>
            {summary.longestStreak > 0 && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Trophy className="w-3.5 h-3.5" /> Best: {summary.longestStreak}d
              </span>
            )}
          </div>
        )}
      </div>

      {/* Calendar */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Last 14 Days</h2>
        <CalendarStrip />
      </div>

      {/* Companion */}
      <CompanionWidget />

      {/* Stats row */}
      {summary && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Habits", value: summary.totalHabits, icon: Zap },
            { label: "Done Today", value: summary.completedToday, icon: CheckCircle2 },
            { label: "All-Time", value: summary.totalCompletions, icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="glass-card rounded-xl p-3 border border-white/8 text-center" data-testid={`stat-${label.toLowerCase().replace(" ", "-")}`}>
              <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: charColor }} />
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Habits */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today's Habits</h2>
          {(habits || []).length >= 7 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
              Max 7 reached
            </span>
          )}
        </div>

        {incompleteToday.length > 0 && incompleteToday.length < (habits || []).length && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
            You left {incompleteToday.length} habit{incompleteToday.length > 1 ? "s" : ""} unfinished today
          </div>
        )}

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {(habits || []).length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card rounded-xl p-8 border border-white/8 text-center"
              >
                <Zap className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">No habits yet. Start your journey.</p>
              </motion.div>
            ) : (
              (habits || []).map((habit) => (
                <HabitCard key={habit.id} habit={{ ...habit, completedDates: habit.completedDates as string[] }} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Insights</h2>
          <div className="space-y-2">
            {insights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-xl px-4 py-3 border border-white/8 text-sm text-foreground/80"
                data-testid={`insight-${insight.id}`}
              >
                {insight.message}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
