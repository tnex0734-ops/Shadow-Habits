import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetHabits, getGetHabitsQueryKey,
  useCreateHabit, useUpdateHabit, useDeleteHabit,
  useCompleteHabit, useUncompleteHabit,
  getGetDashboardSummaryQueryKey, getGetInsightsQueryKey,
  getGetStreaksQueryKey, getGetCompanionMessageQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/contexts/ThemeContext";
import { getTodayStr, formatDate } from "@/lib/utils";
import { Plus, Trash2, Pencil, CheckCircle2, Circle, Flame, X, Swords, Lock, Shield } from "lucide-react";

interface Habit {
  id: number; title: string; description?: string | null;
  completedDates: string[]; currentStreak: number; longestStreak: number; createdAt: string;
}

/* Habit creation/edit form */
function TechniqueForm({ onClose, existing }: { onClose: () => void; existing?: Habit }) {
  const queryClient = useQueryClient();
  const { charColor, charGlow } = useTheme();
  const [title, setTitle] = useState(existing?.title || "");
  const [description, setDescription] = useState(existing?.description || "");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetHabitsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
    onClose();
  };
  const createMutation = useCreateHabit({ mutation: { onSuccess: invalidate } });
  const updateMutation = useUpdateHabit({ mutation: { onSuccess: invalidate } });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (existing) {
      updateMutation.mutate({ id: String(existing.id), data: { title: title.trim(), description: description.trim() || undefined } });
    } else {
      createMutation.mutate({ data: { title: title.trim(), description: description.trim() || undefined } });
    }
  };
  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = (createMutation.error as { data?: { message?: string } } | null)?.data?.message;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border overflow-hidden mb-4"
      style={{ background: "rgba(6,18,6,0.9)", borderColor: `${charColor}30`, boxShadow: `0 0 24px ${charColor}18`, backdropFilter: "blur(24px)" }}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: `${charColor}18` }}>
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4" style={{ color: charColor }} />
          <span className="font-display text-sm tracking-widest uppercase" style={{ color: charColor }}>
            {existing ? "Modify Technique" : "Register Technique"}
          </span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg transition-colors hover:bg-white/5">
          <X className="w-4 h-4 text-white/40" />
        </button>
      </div>
      <div className="p-5">
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm border" style={{ backgroundColor: "rgba(255,30,30,0.1)", borderColor: "rgba(255,30,30,0.3)", color: "#ff6b6b" }} data-testid="error-habit-form">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: `${charColor}80` }}>
              Technique Name
            </label>
            <input
              type="text" value={title} onChange={e => setTitle(e.target.value)}
              required placeholder="e.g. Morning meditation ritual"
              autoFocus className="cyber-input" data-testid="input-habit-title"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: `${charColor}80` }}>
              Description <span style={{ color: "rgba(255,255,255,0.3)" }}>(optional)</span>
            </label>
            <input
              type="text" value={description} onChange={e => setDescription(e.target.value)}
              placeholder="What does this technique train?" className="cyber-input" data-testid="input-habit-description"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all" style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
              Cancel
            </button>
            <motion.button
              type="submit" disabled={isPending}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider disabled:opacity-50"
              style={{ backgroundColor: charColor, color: "#000", boxShadow: `0 0 16px ${charColor}60` }}
              data-testid="button-save-habit"
            >
              {isPending ? "Forging..." : existing ? "Update" : "Register"}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

/* ─── MAIN HABITS PAGE ─── */
export default function HabitsPage() {
  const queryClient = useQueryClient();
  const { charColor, charGlow } = useTheme();
  const { data: habits = [] } = useGetHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const today = getTodayStr();
  const atLimit = habits.length >= 7;

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: getGetHabitsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetInsightsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetStreaksQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetCompanionMessageQueryKey() });
  };
  const deleteMutation = useDeleteHabit({ mutation: { onSuccess: invalidateAll } });
  const completeMutation = useCompleteHabit({ mutation: { onSuccess: invalidateAll } });
  const uncompleteMutation = useUncompleteHabit({ mutation: { onSuccess: invalidateAll } });

  return (
    <div className="space-y-5 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 flame-icon" style={{ color: charColor }} />
            <p className="font-display text-xs tracking-widest uppercase" style={{ color: `${charColor}80` }}>Cursed Techniques</p>
          </div>
          <h1 className="text-2xl font-bold text-white">Your Arsenal</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            {habits.length}/7 techniques registered
            {atLimit && " — Maximum capacity reached"}
          </p>
        </div>
        {!atLimit && !showForm && !editingHabit && (
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm uppercase tracking-wider flex-shrink-0"
            style={{ backgroundColor: charColor, color: "#000", boxShadow: `0 0 18px ${charColor}60` }}
            data-testid="button-add-habit"
          >
            <Plus className="w-4 h-4" /> New Technique
          </motion.button>
        )}
      </div>

      {/* Limit warning */}
      {atLimit && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ backgroundColor: "rgba(255,160,0,0.08)", borderColor: "rgba(255,160,0,0.25)" }}>
          <Lock className="w-4 h-4 flex-shrink-0" style={{ color: "#FFA000" }} />
          <p className="text-sm" style={{ color: "#FFA000" }}>
            A sorcerer can only master <strong>7 techniques</strong>. Remove one to register a new one.
          </p>
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && <TechniqueForm onClose={() => setShowForm(false)} />}
        {editingHabit && <TechniqueForm existing={editingHabit} onClose={() => setEditingHabit(null)} />}
      </AnimatePresence>

      {/* Habits list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {habits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl p-12 border border-dashed flex flex-col items-center gap-4 text-center"
              style={{ borderColor: `${charColor}25` }}
            >
              <Shield className="w-12 h-12" style={{ color: `${charColor}30` }} />
              <div>
                <p className="font-display text-xl tracking-widest uppercase" style={{ color: `${charColor}50` }}>No Techniques Registered</p>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Every sorcerer begins with training their first technique</p>
              </div>
            </motion.div>
          ) : (
            (habits as Habit[]).map((habit) => {
              const isCompleted = habit.completedDates.includes(today);
              const last7 = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(); d.setDate(d.getDate() - (6 - i));
                return habit.completedDates.includes(formatDate(d));
              });

              return (
                <motion.div
                  key={habit.id} layout
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  className="rounded-2xl border overflow-hidden"
                  style={{ background: isCompleted ? `${charColor}08` : "rgba(6,18,6,0.7)", borderColor: isCompleted ? `${charColor}25` : `${charColor}0e`, backdropFilter: "blur(20px)", boxShadow: isCompleted ? `0 0 20px ${charColor}12` : undefined }}
                  data-testid={`habit-item-${habit.id}`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Big completion toggle — Fitts's Law */}
                      <motion.button
                        onClick={() => isCompleted
                          ? uncompleteMutation.mutate({ id: String(habit.id), data: { date: today } })
                          : completeMutation.mutate({ id: String(habit.id), data: { date: today } })
                        }
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.88 }}
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                        style={isCompleted
                          ? { backgroundColor: `${charColor}20`, border: `2px solid ${charColor}`, boxShadow: `0 0 12px ${charColor}50` }
                          : { backgroundColor: "rgba(255,255,255,0.04)", border: "2px solid rgba(255,255,255,0.12)" }
                        }
                        data-testid={`toggle-habit-${habit.id}`}
                      >
                        {isCompleted
                          ? <CheckCircle2 className="w-6 h-6" style={{ color: charColor }} />
                          : <Circle className="w-6 h-6 text-white/25" />
                        }
                      </motion.button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-base leading-tight ${isCompleted ? "line-through opacity-50" : "text-white"}`}>
                              {habit.title}
                            </p>
                            {habit.description && (
                              <p className="text-sm mt-0.5 opacity-40 truncate">{habit.description}</p>
                            )}
                          </div>
                          {/* Streak */}
                          {habit.currentStreak > 0 && (
                            <div
                              className="flex items-center gap-1 px-2 py-1 rounded-lg flex-shrink-0 streak-glow"
                              style={{ backgroundColor: `${charColor}15`, border: `1px solid ${charColor}30` }}
                            >
                              <Flame className="w-3 h-3 flame-icon" style={{ color: charColor }} />
                              <span className="text-xs font-bold" style={{ color: charColor }}>{habit.currentStreak}d</span>
                            </div>
                          )}
                        </div>

                        {/* 7-day completion bar */}
                        <div className="mt-3">
                          <div className="flex gap-1.5 items-center">
                            {last7.map((done, i) => (
                              <div
                                key={i}
                                className="flex-1 h-1.5 rounded-full transition-all"
                                style={{ backgroundColor: done ? charColor : "rgba(255,255,255,0.07)", maxWidth: 24 }}
                              />
                            ))}
                            <span className="text-xs ml-1" style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>7D</span>
                          </div>
                          {habit.longestStreak > 0 && (
                            <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                              Best streak: {habit.longestStreak} days · {habit.completedDates.length} total
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        <button
                          onClick={() => { setShowForm(false); setEditingHabit(habit); }}
                          className="p-2 rounded-lg transition-all hover:bg-white/5"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                          data-testid={`edit-habit-${habit.id}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate({ id: String(habit.id) })}
                          className="p-2 rounded-lg transition-all hover:bg-red-500/10"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                          data-testid={`delete-habit-${habit.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* UX tip — Micro-commitment encouragement */}
      {habits.length > 0 && habits.length < 3 && (
        <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
          Tip: Start with 2–3 techniques and build consistency before adding more.
        </p>
      )}
    </div>
  );
}
