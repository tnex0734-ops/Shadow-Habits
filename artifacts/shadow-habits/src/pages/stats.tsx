import { motion } from "framer-motion";
import {
  useGetDashboardSummary,
  useGetStreaks,
  useGetInsights,
} from "@workspace/api-client-react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Flame, TrendingUp, BarChart2, Zap } from "lucide-react";

function CustomDot(props: { cx?: number; cy?: number; charImage?: string; charColor?: string; charGlow?: string }) {
  const { cx = 0, cy = 0, charImage = "", charColor = "#0ea5e9", charGlow = "rgba(14,165,233,0.4)" } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill="none" stroke={charColor} strokeWidth={2} style={{ filter: `drop-shadow(0 0 6px ${charGlow})` }} />
      <image href={charImage} x={cx - 8} y={cy - 8} width={16} height={16} clipPath="url(#avatar-clip)" style={{ borderRadius: "50%" }} />
    </g>
  );
}

export default function StatsPage() {
  const { charColor, charGlow, charImage } = useTheme();
  const { data: summary } = useGetDashboardSummary();
  const { data: streaks } = useGetStreaks();
  const { data: insights } = useGetInsights();

  const chartData = summary?.weeklyData || [];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-xl px-3 py-2 border border-white/10 text-xs">
          <p className="text-muted-foreground">{label}</p>
          <p className="font-semibold" style={{ color: charColor }}>{payload[0].value} completed</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your cursed energy performance</p>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Completion Rate", value: `${Math.round(summary.completionRate * 100)}%`, icon: TrendingUp, sub: "today" },
            { label: "Longest Streak", value: `${summary.longestStreak}d`, icon: Flame, sub: "all time" },
            { label: "Total Habits", value: summary.totalHabits, icon: Zap, sub: "active" },
            { label: "Total Completions", value: summary.totalCompletions, icon: BarChart2, sub: "all time" },
          ].map(({ label, value, icon: Icon, sub }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-xl p-4 border border-white/8"
              data-testid={`stat-card-${label.toLowerCase().replace(/ /g, "-")}`}
            >
              <Icon className="w-4 h-4 mb-2" style={{ color: charColor }} />
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xs text-muted-foreground/60">{sub}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Weekly chart */}
      <div className="glass-card rounded-2xl p-5 border border-white/8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Weekly Completions</h2>
        {chartData.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData} margin={{ top: 10, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={charColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={charColor} stopOpacity={0} />
                </linearGradient>
                <clipPath id="avatar-clip">
                  <circle cx={8} cy={8} r={8} />
                </clipPath>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: charColor, strokeWidth: 1, strokeDasharray: "4 4" }} />
              <Area
                type="monotone"
                dataKey="completed"
                stroke={charColor}
                strokeWidth={2}
                fill="url(#colorCompleted)"
                dot={(props) => <CustomDot {...props} charImage={charImage} charColor={charColor} charGlow={charGlow} />}
                activeDot={{ r: 6, fill: charColor, stroke: "none" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Streaks */}
      {streaks && streaks.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Habit Streaks</h2>
          <div className="space-y-2">
            {(streaks as Array<{ habitId: number; habitTitle: string; currentStreak: number; longestStreak: number; lastCompletedDate?: string }>)
              .sort((a, b) => b.currentStreak - a.currentStreak)
              .map((s) => (
                <motion.div
                  key={s.habitId}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card rounded-xl px-4 py-3 border border-white/8"
                  data-testid={`streak-item-${s.habitId}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{s.habitTitle}</p>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Current</p>
                        <div className="flex items-center gap-1 justify-end">
                          <Flame className="w-3 h-3 text-orange-400" />
                          <span className="text-sm font-bold" style={{ color: s.currentStreak > 0 ? charColor : undefined }}>
                            {s.currentStreak}d
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Best</p>
                        <span className="text-sm font-bold text-foreground">{s.longestStreak}d</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: Math.min(s.longestStreak, 14) }, (_, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full"
                        style={{ backgroundColor: i < s.currentStreak ? charColor : "rgba(255,255,255,0.1)", maxWidth: 12 }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {insights && insights.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Cursed Insights</h2>
          <div className="space-y-2">
            {insights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-xl px-4 py-3 border text-sm text-foreground/80"
                style={{ borderColor: `${charColor}25`, backgroundColor: `${charColor}08` }}
                data-testid={`insight-stat-${insight.id}`}
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
