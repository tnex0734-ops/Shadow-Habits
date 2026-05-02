import { motion } from "framer-motion";
import { useGetDashboardSummary, useGetStreaks, useGetInsights } from "@workspace/api-client-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Flame, TrendingUp, BarChart2, Zap, Trophy, ChevronRight, Star } from "lucide-react";

/* Sorcerer Grade System — UX Law: Gamification + Goal Gradient */
const GRADES = [
  { label: "UNRANKED",        min: 0,   max: 19,  color: "#555",    description: "Begin your training, young sorcerer." },
  { label: "GRADE 4",         min: 20,  max: 39,  color: "#888",    description: "You've taken your first steps." },
  { label: "GRADE 3",         min: 40,  max: 54,  color: "#FF6B00", description: "Cursed energy is awakening within you." },
  { label: "GRADE 2",         min: 55,  max: 69,  color: "#FFA000", description: "Your technique grows stronger each day." },
  { label: "GRADE 1",         min: 70,  max: 84,  color: "#00E5FF", description: "You rival the mightiest sorcerers." },
  { label: "SEMI-SPECIAL",    min: 85,  max: 99,  color: "#AAFF00", description: "Your power approaches the realm of legends." },
  { label: "SPECIAL GRADE",   min: 100, max: 100, color: "#FFFFFF", description: "Domain Expanded. You are untouchable." },
];

function getGrade(pct: number) {
  return GRADES.find(g => pct >= g.min && pct <= g.max) || GRADES[0];
}
function getNextGrade(pct: number) {
  const idx = GRADES.findIndex(g => pct >= g.min && pct <= g.max);
  return idx < GRADES.length - 1 ? GRADES[idx + 1] : null;
}

function CustomTooltip({ active, payload, label, charColor }: { active?: boolean; payload?: Array<{ value: number }>; label?: string; charColor: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 border text-xs" style={{ background: "rgba(6,18,6,0.95)", borderColor: `${charColor}30`, backdropFilter: "blur(12px)" }}>
      <p style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
      <p className="font-bold mt-0.5" style={{ color: charColor }}>{payload[0].value} techniques mastered</p>
    </div>
  );
}

export default function StatsPage() {
  const { charColor, charGlow, charGlowSoft, charImage } = useTheme();
  const { data: summary } = useGetDashboardSummary();
  const { data: streaks } = useGetStreaks();
  const { data: insights } = useGetInsights();

  const completionPct = summary ? Math.round(summary.completionRate * 100) : 0;
  const grade = getGrade(completionPct);
  const nextGrade = getNextGrade(completionPct);
  const chartData = summary?.weeklyData || [];

  return (
    <div className="space-y-5 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4" style={{ color: charColor }} />
            <p className="font-display text-xs tracking-widest uppercase" style={{ color: `${charColor}80` }}>Sorcerer Records</p>
          </div>
          <h1 className="text-2xl font-bold text-white">Performance Archive</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Your cursed energy history and ranking</p>
        </div>
      </div>

      {/* ── SORCERER GRADE CARD ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border relative overflow-hidden"
        style={{ background: "rgba(6,18,6,0.75)", borderColor: `${grade.color}30`, backdropFilter: "blur(20px)", boxShadow: `0 0 40px ${grade.color}12` }}
      >
        <div className="absolute inset-0 opacity-15" style={{ background: `radial-gradient(ellipse at 70% 50%, ${grade.color}40, transparent 70%)` }} />
        <div className="relative z-10 p-5">
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0"
              style={{ borderColor: grade.color, boxShadow: `0 0 24px ${grade.color}60` }}
            >
              <img src={charImage} alt="character" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="font-display text-2xl tracking-widest"
                  style={{ color: grade.color, textShadow: `0 0 20px ${grade.color}80` }}
                >
                  {grade.label}
                </span>
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{grade.description}</p>

              {/* Progress to next grade */}
              {nextGrade && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>→ {nextGrade.label}</span>
                    <span className="text-xs font-bold" style={{ color: grade.color }}>{completionPct}%</span>
                  </div>
                  <div className="cursed-bar-track h-2">
                    <motion.div
                      className="cursed-bar-fill h-2"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(((completionPct - grade.min) / (nextGrade.min - grade.min)) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{ background: `linear-gradient(90deg, ${grade.color}88, ${grade.color})` } as React.CSSProperties}
                    />
                  </div>
                </div>
              )}
              {!nextGrade && (
                <div className="mt-2 px-3 py-1 rounded-lg inline-block" style={{ backgroundColor: `${grade.color}15`, border: `1px solid ${grade.color}30` }}>
                  <span className="text-xs font-bold" style={{ color: grade.color }}>✦ MAXIMUM RANK ACHIEVED ✦</span>
                </div>
              )}
            </div>
          </div>

          {/* Grade progression strip */}
          <div className="mt-5 flex gap-1.5 items-center">
            {GRADES.map((g, i) => {
              const isCurrentOrPast = completionPct >= g.min;
              const isCurrent = g.label === grade.label;
              return (
                <motion.div
                  key={g.label}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex-1 rounded-full"
                  style={{
                    height: isCurrent ? 8 : 5,
                    backgroundColor: isCurrentOrPast ? g.color : "rgba(255,255,255,0.06)",
                    boxShadow: isCurrent ? `0 0 8px ${g.color}` : undefined,
                    transition: "height 0.3s ease",
                  }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)", fontSize: 9 }}>UNRANKED</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)", fontSize: 9 }}>SPECIAL GRADE</span>
          </div>
        </div>
      </motion.div>

      {/* 2-column grid for stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Weekly cursed energy chart */}
        <div className="rounded-2xl border p-5" style={{ background: "rgba(6,18,6,0.7)", borderColor: `${charColor}15`, backdropFilter: "blur(20px)" }}>
          <h2 className="font-display text-sm tracking-widest uppercase mb-4" style={{ color: `${charColor}70` }}>
            Weekly Cursed Energy Output
          </h2>
          {chartData.length === 0 ? (
            <div className="h-36 flex items-center justify-center" style={{ color: "rgba(255,255,255,0.25)" }}>
              <p className="text-sm">No battle records yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={chartData} margin={{ top: 8, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={charColor} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={charColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.35)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip charColor={charColor} />} cursor={{ stroke: charColor, strokeWidth: 1, strokeDasharray: "4 4", strokeOpacity: 0.4 }} />
                <Area type="monotone" dataKey="completed" stroke={charColor} strokeWidth={2}
                  fill="url(#energyGrad)"
                  dot={{ r: 3, fill: charColor, stroke: "none" }}
                  activeDot={{ r: 5, fill: charColor, stroke: charColor, strokeWidth: 2, strokeOpacity: 0.4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Stats summary */}
        {summary && (
          <div className="space-y-3">
            {[
              { label: "Today's Output", value: `${completionPct}%`, sub: "completion rate", icon: TrendingUp },
              { label: "Longest Streak", value: `${summary.longestStreak}d`, sub: "cursed energy chain", icon: Flame },
              { label: "Total Techniques", value: summary.totalHabits, sub: "registered", icon: Zap },
              { label: "Total Masterys", value: summary.totalCompletions, sub: "all-time completions", icon: BarChart2 },
            ].map(({ label, value, sub, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 rounded-xl px-4 py-3 border"
                style={{ background: "rgba(6,18,6,0.65)", borderColor: `${charColor}12`, backdropFilter: "blur(16px)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${charColor}15` }}>
                  <Icon className="w-4 h-4" style={{ color: charColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                  <p className="font-bold text-white text-base leading-tight">{value}</p>
                </div>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{sub}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Technique streak leaderboard */}
      {streaks && (streaks as Array<{ habitId: number; habitTitle: string; currentStreak: number; longestStreak: number }>).length > 0 && (
        <div>
          <h2 className="font-display text-sm tracking-widest uppercase mb-3" style={{ color: `${charColor}70` }}>
            Technique Mastery Rankings
          </h2>
          <div className="space-y-2">
            {(streaks as Array<{ habitId: number; habitTitle: string; currentStreak: number; longestStreak: number }>)
              .sort((a, b) => b.currentStreak - a.currentStreak)
              .map((s, i) => (
                <motion.div
                  key={s.habitId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-xl px-4 py-3 border"
                  style={{ background: i === 0 && s.currentStreak > 0 ? `${charColor}08` : "rgba(6,18,6,0.6)", borderColor: i === 0 && s.currentStreak > 0 ? `${charColor}25` : `${charColor}0e`, backdropFilter: "blur(16px)" }}
                  data-testid={`streak-item-${s.habitId}`}
                >
                  <span className="font-display text-lg w-6 text-center flex-shrink-0" style={{ color: i === 0 ? charColor : "rgba(255,255,255,0.25)" }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{s.habitTitle}</p>
                    <div className="flex gap-1 mt-1.5">
                      {Array.from({ length: Math.min(s.longestStreak || 0, 14) }, (_, j) => (
                        <div
                          key={j}
                          className="flex-1 h-1 rounded-full"
                          style={{ backgroundColor: j < s.currentStreak ? charColor : "rgba(255,255,255,0.07)", maxWidth: 14 }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Flame className="w-3 h-3 flame-icon" style={{ color: s.currentStreak > 0 ? charColor : "rgba(255,255,255,0.2)" }} />
                        <span className="text-sm font-bold" style={{ color: s.currentStreak > 0 ? charColor : "rgba(255,255,255,0.35)" }}>
                          {s.currentStreak}d
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)", fontSize: 9 }}>CURRENT</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <Trophy className="w-3 h-3" style={{ color: "rgba(255,255,255,0.3)" }} />
                        <span className="text-sm font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>{s.longestStreak}d</span>
                      </div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)", fontSize: 9 }}>BEST</p>
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
          <h2 className="font-display text-sm tracking-widest uppercase mb-3" style={{ color: `${charColor}70` }}>
            Cursed Spirit Intel
          </h2>
          <div className="space-y-2">
            {insights.map((ins, i) => (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className="flex items-start gap-3 rounded-xl px-4 py-3 border text-sm"
                style={{ backgroundColor: `${charColor}07`, borderColor: `${charColor}18`, color: "rgba(255,255,255,0.65)" }}
              >
                <ChevronRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: charColor }} />
                {ins.message}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
