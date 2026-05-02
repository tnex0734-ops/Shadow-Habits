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
import { Plus, Trash2, Pencil, CheckCircle2, Circle, Flame, X, Lock } from "lucide-react";

interface Habit {
  id: number; title: string; description?: string | null;
  completedDates: string[]; currentStreak: number; longestStreak: number;
}

function HabitForm({ onClose, existing }: { onClose: () => void; existing?: Habit }) {
  const queryClient = useQueryClient();
  const { charColor, charGlow } = useTheme();
  const [title, setTitle] = useState(existing?.title || "");
  const [desc, setDesc] = useState(existing?.description || "");

  const inv = () => { queryClient.invalidateQueries({ queryKey: getGetHabitsQueryKey() }); onClose(); };
  const create = useCreateHabit({ mutation: { onSuccess: inv } });
  const update = useUpdateHabit({ mutation: { onSuccess: inv } });
  const isPending = create.isPending || update.isPending;
  const err = (create.error as { data?: { message?: string } } | null)?.data?.message;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    existing
      ? update.mutate({ id: String(existing.id), data: { title: title.trim(), description: desc.trim() || undefined } })
      : create.mutate({ data: { title: title.trim(), description: desc.trim() || undefined } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border overflow-hidden mb-4"
      style={{ background: "rgba(4,12,22,0.92)", borderColor: `${charColor}28`, boxShadow: `0 0 32px ${charColor}12`, backdropFilter: "blur(24px)" }}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: `${charColor}14` }}>
        <h3 className="font-bold text-white">{existing ? "Edit Habit" : "New Habit"}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <X className="w-4 h-4 text-white/40" />
        </button>
      </div>
      <div className="p-5">
        {err && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm border" style={{ backgroundColor: "rgba(255,30,30,0.1)", borderColor: "rgba(255,30,30,0.28)", color: "#ff6b6b" }} data-testid="error-habit-form">
            {err}
          </div>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: `${charColor}80` }}>Habit Name</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Morning workout"
              autoFocus className="cyber-input" data-testid="input-habit-title" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: `${charColor}80` }}>Description <span style={{ color: "rgba(255,255,255,0.25)" }}>(optional)</span></label>
            <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What does this habit involve?"
              className="cyber-input" data-testid="input-habit-description" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all"
              style={{ borderColor: "rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.45)" }}>Cancel</button>
            <motion.button type="submit" disabled={isPending}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider disabled:opacity-50"
              style={{ backgroundColor: charColor, color: "#000", boxShadow: `0 0 20px ${charColor}50` }}
              data-testid="button-save-habit">
              {isPending ? "Saving..." : existing ? "Save Changes" : "Add Habit"}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default function HabitsPage() {
  const queryClient = useQueryClient();
  const { charColor, charGlow } = useTheme();
  const { data: habits = [] } = useGetHabits();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const today = getTodayStr();
  const atLimit = habits.length >= 7;

  const inv = () => {
    [getGetHabitsQueryKey, getGetDashboardSummaryQueryKey, getGetInsightsQueryKey, getGetStreaksQueryKey, getGetCompanionMessageQueryKey]
      .forEach(k => queryClient.invalidateQueries({ queryKey: k() }));
  };
  const del = useDeleteHabit({ mutation: { onSuccess: inv } });
  const complete = useCompleteHabit({ mutation: { onSuccess: inv } });
  const uncomplete = useUncompleteHabit({ mutation: { onSuccess: inv } });

  return (
    <div className="h-full flex flex-col px-6 pt-6 pb-3 overflow-hidden max-w-2xl mx-auto w-full">

      {/* Header */}
      <div className="flex-shrink-0 flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: `${charColor}70` }}>Daily Habits</p>
          <h1 className="text-3xl font-bold text-white">Your Arsenal</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            {habits.length}/7 habits registered{atLimit && " — limit reached"}
          </p>
        </div>
        {!atLimit && !showForm && !editing && (
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: charColor, color: "#000", boxShadow: `0 0 20px ${charColor}55` }}
            data-testid="button-add-habit"
          >
            <Plus className="w-4 h-4" /> New Habit
          </motion.button>
        )}
      </div>

      {/* Limit notice */}
      {atLimit && (
        <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3.5 rounded-2xl border mb-4"
          style={{ backgroundColor: "rgba(255,160,0,0.07)", borderColor: "rgba(255,160,0,0.2)" }}>
          <Lock className="w-4 h-4 flex-shrink-0" style={{ color: "#FFA000" }} />
          <p className="text-sm" style={{ color: "#FFA000" }}>
            Maximum of <strong>7 habits</strong> — remove one to add more
          </p>
        </div>
      )}

      {/* Form */}
      <div className="flex-shrink-0">
        <AnimatePresence>
          {showForm && <HabitForm onClose={() => setShowForm(false)} />}
          {editing && <HabitForm existing={editing} onClose={() => setEditing(null)} />}
        </AnimatePresence>
      </div>

      {/* List — scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-3 pb-2">
        <AnimatePresence mode="popLayout">
          {habits.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-5 py-16 text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor: `${charColor}0e`, border: `1px solid ${charColor}20` }}>
                <Plus className="w-10 h-10" style={{ color: `${charColor}40` }} />
              </div>
              <div>
                <p className="font-bold text-white/60 text-xl">No habits yet</p>
                <p className="text-sm text-white/35 mt-1">Add your first habit to start building consistency</p>
              </div>
            </motion.div>
          ) : (
            (habits as Habit[]).map(habit => {
              const isCompleted = habit.completedDates.includes(today);
              const last7 = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(); d.setDate(d.getDate() - (6 - i));
                return habit.completedDates.includes(formatDate(d));
              });

              return (
                <motion.div key={habit.id} layout
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: -8 }}
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    background: isCompleted ? `${charColor}08` : "rgba(4,12,22,0.75)",
                    borderColor: isCompleted ? `${charColor}22` : `${charColor}0c`,
                    backdropFilter: "blur(20px)",
                  }}
                  data-testid={`habit-item-${habit.id}`}
                >
                  <div className="p-4 flex items-center gap-4">
                    {/* Toggle */}
                    <motion.button
                      onClick={() => isCompleted
                        ? uncomplete.mutate({ id: String(habit.id), data: { date: today } })
                        : complete.mutate({ id: String(habit.id), data: { date: today } })}
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.86 }}
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                      style={isCompleted
                        ? { backgroundColor: `${charColor}1e`, border: `2px solid ${charColor}`, boxShadow: `0 0 14px ${charColor}55` }
                        : { backgroundColor: "transparent", border: "2px solid rgba(255,255,255,0.12)" }
                      }
                      data-testid={`toggle-habit-${habit.id}`}
                    >
                      {isCompleted
                        ? <CheckCircle2 className="w-5 h-5" style={{ color: charColor }} />
                        : <Circle className="w-5 h-5 text-white/22" />
                      }
                    </motion.button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-semibold text-[15px] leading-tight ${isCompleted ? "line-through text-white/38" : "text-white"}`}>
                          {habit.title}
                        </p>
                        {habit.currentStreak > 0 && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: `${charColor}12`, border: `1px solid ${charColor}28` }}>
                            <Flame className="w-3 h-3 flame-icon" style={{ color: charColor }} />
                            <span className="text-xs font-bold" style={{ color: charColor }}>{habit.currentStreak}d</span>
                          </div>
                        )}
                      </div>
                      {habit.description && (
                        <p className="text-xs text-white/35 mb-2 truncate">{habit.description}</p>
                      )}
                      {/* 7-day dots */}
                      <div className="flex gap-1.5 items-center">
                        {last7.map((done, i) => (
                          <div key={i} className="w-5 h-1.5 rounded-full transition-all"
                            style={{ backgroundColor: done ? charColor : "rgba(255,255,255,0.07)" }} />
                        ))}
                        <span className="text-xs ml-1" style={{ color: "rgba(255,255,255,0.25)", fontSize: 9 }}>7D</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => { setShowForm(false); setEditing(habit); }}
                        className="p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                        style={{ color: "rgba(255,255,255,0.3)" }} data-testid={`edit-habit-${habit.id}`}>
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => del.mutate({ id: String(habit.id) })}
                        className="p-2.5 rounded-xl hover:bg-red-500/10 transition-colors"
                        style={{ color: "rgba(255,255,255,0.3)" }} data-testid={`delete-habit-${habit.id}`}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
