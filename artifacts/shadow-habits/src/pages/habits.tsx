import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetHabits,
  getGetHabitsQueryKey,
  useCreateHabit,
  useUpdateHabit,
  useDeleteHabit,
  useCompleteHabit,
  useUncompleteHabit,
  getGetDashboardSummaryQueryKey,
  getGetInsightsQueryKey,
  getGetStreaksQueryKey,
  getGetCompanionMessageQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/contexts/ThemeContext";
import { getTodayStr, formatDate } from "@/lib/utils";
import { Plus, Trash2, Pencil, CheckCircle2, Circle, Flame, X, Check } from "lucide-react";

interface Habit {
  id: number;
  title: string;
  description?: string | null;
  completedDates: string[];
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
}

function HabitForm({ onClose, existing }: { onClose: () => void; existing?: Habit }) {
  const queryClient = useQueryClient();
  const { charColor } = useTheme();
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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card rounded-xl p-4 border border-white/10 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">{existing ? "Edit Habit" : "New Habit"}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      {error && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-xs" data-testid="error-habit-form">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Habit name (e.g. Morning meditation)"
          autoFocus
          className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
          data-testid="input-habit-title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40"
          data-testid="input-habit-description"
        />
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ backgroundColor: charColor, color: "#000" }}
            data-testid="button-save-habit"
          >
            {isPending ? "Saving..." : existing ? "Update" : "Add Habit"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default function HabitsPage() {
  const queryClient = useQueryClient();
  const { charColor, charGlow } = useTheme();
  const { data: habits } = useGetHabits();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const today = getTodayStr();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: getGetHabitsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetInsightsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetStreaksQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetCompanionMessageQueryKey() });
  };

  const deleteMutation = useDeleteHabit({ mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetHabitsQueryKey() }) } });
  const completeMutation = useCompleteHabit({ mutation: { onSuccess: invalidateAll } });
  const uncompleteMutation = useUncompleteHabit({ mutation: { onSuccess: invalidateAll } });

  const atLimit = (habits || []).length >= 7;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Habits</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{(habits || []).length}/7 habits active</p>
        </div>
        {!atLimit && !showForm && !editingHabit && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: charColor, color: "#000", boxShadow: `0 0 14px ${charGlow}` }}
            data-testid="button-add-habit"
          >
            <Plus className="w-4 h-4" />
            Add Habit
          </motion.button>
        )}
      </div>

      {atLimit && (
        <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
          You have reached the maximum of 7 habits. Delete one to add more.
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <HabitForm
            onClose={() => setShowForm(false)}
          />
        )}
        {editingHabit && (
          <HabitForm
            existing={editingHabit}
            onClose={() => setEditingHabit(null)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {(habits || []).length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-xl p-12 border border-white/8 text-center"
            >
              <p className="text-muted-foreground">No habits yet. Add your first one above.</p>
            </motion.div>
          ) : (
            (habits as Habit[]).map((habit) => {
              const isCompleted = habit.completedDates.includes(today);
              const completionDays = habit.completedDates.length;

              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card rounded-xl border border-white/8 overflow-hidden"
                  data-testid={`habit-item-${habit.id}`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => isCompleted
                          ? uncompleteMutation.mutate({ id: String(habit.id), data: { date: today } })
                          : completeMutation.mutate({ id: String(habit.id), data: { date: today } })
                        }
                        className="mt-0.5 flex-shrink-0"
                        data-testid={`toggle-habit-${habit.id}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6" style={{ color: charColor, filter: `drop-shadow(0 0 6px ${charGlow})` }} />
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${isCompleted ? "line-through opacity-60" : ""}`}>{habit.title}</p>
                        {habit.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{habit.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {habit.currentStreak > 0 && (
                            <span className="flex items-center gap-1 text-xs text-orange-400">
                              <Flame className="w-3 h-3" /> {habit.currentStreak}d streak
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">{completionDays} total completions</span>
                          {habit.longestStreak > 0 && (
                            <span className="text-xs text-muted-foreground">Best: {habit.longestStreak}d</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => { setShowForm(false); setEditingHabit(habit); }}
                          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                          data-testid={`edit-habit-${habit.id}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate({ id: String(habit.id) })}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          data-testid={`delete-habit-${habit.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Mini completion history */}
                  <div className="px-4 pb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: 7 }, (_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (6 - i));
                        const ds = formatDate(d);
                        const done = habit.completedDates.includes(ds);
                        return (
                          <div
                            key={i}
                            className="flex-1 h-1.5 rounded-full transition-all"
                            style={{ backgroundColor: done ? charColor : "rgba(255,255,255,0.1)" }}
                          />
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
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
