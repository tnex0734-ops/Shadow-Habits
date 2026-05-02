import { motion } from "framer-motion";
import { useGetDashboardSummary, useGetStreaks, useGetInsights } from "@workspace/api-client-react";
import { useTheme } from "@/contexts/ThemeContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Flame, Trophy, TrendingUp, Zap } from "lucide-react";

const GRADES = [
  { label: "Unranked",       min: 0,   max: 19,  color: "#444" },
  { label: "Grade 4",        min: 20,  max: 39,  color: "#666" },
  { label: "Grade 3",        min: 40,  max: 54,  color: "#FF6B00" },
  { label: "Grade 2",        min: 55,  max: 69,  color: "#FFA000" },
  { label: "Grade 1",        min: 70,  max: 84,  color: "#00C8FF" },
  { label: "Semi-Special",   min: 85,  max: 99,  color: "#AA80FF" },
  { label: "Special Grade",  min: 100, max: 100, color: "#FFFFFF" },
];
const getGrade = (p: number) => GRADES.find(g => p >= g.min && p <= g.max) || GRADES[0];
const getNext  = (p: number) => { const i = GRADES.findIndex(g => p >= g.min && p <= g.max); return i < GRADES.length - 1 ? GRADES[i + 1] : null; };

function ChartTip({ active, payload, label, charColor }: { active?: boolean; payload?: Array<{ value: number }>; label?: string; charColor: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 rounded-xl text-xs border" style={{ background: "rgba(4,12,22,0.96)", borderColor: `${charColor}30` }}>
      <p style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
      <p className="font-bold mt-0.5" style={{ color: charColor }}>{payload[0].value} done</p>
    </div>
  );
}

export default function StatsPage() {
  const { charColor, charGlow, charImage } = useTheme();
  const { data: summary } = useGetDashboardSummary();
  const { data: streaks } = useGetStreaks();
  const { data: insights } = useGetInsights();

  const pct = summary ? Math.round(summary.completionRate * 100) : 0;
  const grade = getGrade(pct);
  const next = getNext(pct);

  return (
    <div className="h-full flex flex-col px-6 pt-6 pb-3 overflow-hidden max-w-5xl mx-auto w-full gap-5">

      {/* Header */}
      <div className="flex-shrink-0">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: `${charColor}70` }}>Performance</p>
        <h1 className="text-3xl font-bold text-white">Your Stats</h1>
      </div>

      {/* Main scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-4 pb-2">

        {/* Grade card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border p-5 relative overflow-hidden"
          style={{ background: "rgba(4,12,22,0.8)", borderColor: `${grade.color}30`, backdropFilter: "blur(24px)" }}>
          <div className="absolute inset-0 opacity-12" style={{ background: `radial-gradient(ellipse at 70% 50%, ${grade.color}50, transparent 70%)` }} />
          <div className="relative flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: grade.color, boxShadow: `0 0 24px ${grade.color}55` }}>
              <img src={charImage} alt="character" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="font-bold text-2xl" style={{ color: grade.color, textShadow: `0 0 20px ${grade.color}80` }}>{grade.label}</span>
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>sorcerer rank</span>
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                {pct === 100 ? "Perfect score — all habits complete!" : next ? `${next.min - pct}% more to reach ${next.label}` : "Maximum rank reached"}
              </p>
              <div className="mt-3">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.07)" }}>
                  <motion.div className="h-1.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: next ? `${Math.max(0, ((pct - grade.min) / (next.min - grade.min)) * 100)}%` : "100%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{ background: `linear-gradient(90deg, ${grade.color}90, ${grade.color})`, boxShadow: `0 0 8px ${grade.color}` }} />
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-4xl font-bold" style={{ color: grade.color }}>{pct}<span className="text-xl">%</span></p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>completion</p>
            </div>
          </div>

          {/* Grade strip */}
          <div className="flex gap-1.5 mt-4">
            {GRADES.map((g, i) => {
              const past = pct >= g.min;
              const curr = g.label === grade.label;
              return (
                <div key={i} className="flex-1 rounded-full transition-all"
                  style={{ height: curr ? 6 : 4, backgroundColor: past ? g.color : "rgba(255,255,255,0.06)", boxShadow: curr ? `0 0 8px ${g.color}` : undefined }} />
              );
            })}
          </div>
        </motion.div>

        {/* 2-col: chart + stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Weekly chart */}
          <div className="rounded-2xl border p-5" style={{ background: "rgba(4,12,22,0.75)", borderColor: `${charColor}15`, backdropFilter: "blur(20px)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>Weekly Activity</p>
            {(summary?.weeklyData || []).length === 0 ? (
              <div className="h-32 flex items-center justify-center text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={summary?.weeklyData || []} margin={{ top: 5, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={charColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={charColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.25)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTip charColor={charColor} />} cursor={{ stroke: charColor, strokeWidth: 1, strokeDasharray: "4 4", strokeOpacity: 0.35 }} />
                  <Area type="monotone" dataKey="completed" stroke={charColor} strokeWidth={2}
                    fill="url(#areaGrad)" dot={{ r: 3, fill: charColor, stroke: "none" }}
                    activeDot={{ r: 5, fill: charColor }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Stat cards */}
          <div className="space-y-3">
            {[
              { icon: Flame, label: "Longest Streak", value: `${summary?.longestStreak ?? 0} days`, color: "#FFA000" },
              { icon: TrendingUp, label: "Completion Rate", value: `${pct}%`, color: charColor },
              { icon: Zap, label: "Total Habits", value: summary?.totalHabits ?? 0, color: charColor },
              { icon: Trophy, label: "All-Time Completions", value: summary?.totalCompletions ?? 0, color: charColor },
            ].map(({ icon: Icon, label, value, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 rounded-2xl px-4 py-3.5 border"
                style={{ background: "rgba(4,12,22,0.7)", borderColor: `${charColor}10`, backdropFilter: "blur(16px)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}14` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                  <p className="font-bold text-white text-base">{value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Streak leaderboard */}
        {streaks && (streaks as Array<{ habitId: number; habitTitle: string; currentStreak: number; longestStreak: number }>).length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
              Habit Streaks
            </p>
            <div className="space-y-2.5">
              {(streaks as Array<{ habitId: number; habitTitle: string; currentStreak: number; longestStreak: number }>)
                .sort((a, b) => b.currentStreak - a.currentStreak)
                .map((s, i) => (
                  <motion.div key={s.habitId}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 rounded-2xl px-4 py-3.5 border"
                    style={{
                      background: i === 0 && s.currentStreak > 0 ? `${charColor}08` : "rgba(4,12,22,0.65)",
                      borderColor: i === 0 && s.currentStreak > 0 ? `${charColor}22` : `${charColor}0a`,
                      backdropFilter: "blur(16px)",
                    }}
                    data-testid={`streak-item-${s.habitId}`}
                  >
                    <span className="font-bold text-lg w-6 text-center flex-shrink-0" style={{ color: i === 0 ? charColor : "rgba(255,255,255,0.2)" }}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{s.habitTitle}</p>
                      <div className="flex gap-1.5 mt-1.5">
                        {Array.from({ length: Math.min(s.longestStreak || 0, 14) }, (_, j) => (
                          <div key={j} className="flex-1 h-1 rounded-full" style={{ backgroundColor: j < s.currentStreak ? charColor : "rgba(255,255,255,0.07)", maxWidth: 14 }} />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 flex-shrink-0 text-right">
                      <div>
                        <div className="flex items-center gap-1 justify-end">
                          <Flame className="w-3 h-3 flame-icon" style={{ color: s.currentStreak > 0 ? charColor : "rgba(255,255,255,0.2)" }} />
                          <span className="font-bold text-sm" style={{ color: s.currentStreak > 0 ? charColor : "rgba(255,255,255,0.35)" }}>{s.currentStreak}d</span>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 9 }}>NOW</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 justify-end">
                          <Trophy className="w-3 h-3" style={{ color: "rgba(255,255,255,0.3)" }} />
                          <span className="font-bold text-sm text-white/45">{s.longestStreak}d</span>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 9 }}>BEST</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Insights */}
        {insights && insights.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>Insights</p>
            <div className="space-y-2">
              {insights.map((ins, i) => (
                <motion.div key={ins.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  className="px-4 py-3 rounded-xl border text-sm"
                  style={{ backgroundColor: `${charColor}07`, borderColor: `${charColor}15`, color: "rgba(255,255,255,0.6)" }}>
                  {ins.message}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
