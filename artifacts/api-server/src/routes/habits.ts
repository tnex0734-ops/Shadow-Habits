import { Router } from "express";
import { db, habitsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";

const router = Router();

function calcStreak(dates: string[]): { current: number; longest: number } {
  if (!dates.length) return { current: 0, longest: 0 };
  const sorted = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let current = 0;
  let longest = 0;
  let streak = 0;
  let prev: Date | null = null;

  const latestDate = new Date(sorted[0]);
  latestDate.setHours(0, 0, 0, 0);
  const isActiveToday = latestDate.getTime() === today.getTime() || latestDate.getTime() === yesterday.getTime();

  for (const dateStr of sorted) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    if (!prev) {
      streak = 1;
      prev = d;
    } else {
      const diff = (prev.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
        prev = d;
      } else {
        if (streak > longest) longest = streak;
        streak = 1;
        prev = d;
      }
    }
  }
  if (streak > longest) longest = streak;
  current = isActiveToday ? streak : 0;
  return { current, longest };
}

router.use(authMiddleware);

router.get("/habits", async (req: AuthRequest, res) => {
  try {
    const habits = await db.select().from(habitsTable).where(eq(habitsTable.userId, req.userId!));
    res.json(habits);
  } catch (err) {
    req.log.error({ err }, "Get habits error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.post("/habits", async (req: AuthRequest, res) => {
  const { title, description } = req.body;
  if (!title?.trim()) {
    res.status(400).json({ error: "bad_request", message: "Title is required" });
    return;
  }
  try {
    const existing = await db.select().from(habitsTable).where(eq(habitsTable.userId, req.userId!));
    if (existing.length >= 7) {
      res.status(400).json({ error: "limit_exceeded", message: "Maximum 7 habits allowed" });
      return;
    }
    const [habit] = await db.insert(habitsTable).values({
      userId: req.userId!,
      title: title.trim(),
      description: description?.trim() || null,
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
    }).returning();
    res.status(201).json(habit);
  } catch (err) {
    req.log.error({ err }, "Create habit error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.put("/habits/:id", async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const { title, description } = req.body;
  try {
    const [existing] = await db.select().from(habitsTable).where(
      and(eq(habitsTable.id, id), eq(habitsTable.userId, req.userId!))
    );
    if (!existing) {
      res.status(404).json({ error: "not_found", message: "Habit not found" });
      return;
    }
    const [habit] = await db.update(habitsTable)
      .set({
        ...(title ? { title: title.trim() } : {}),
        ...(description !== undefined ? { description: description?.trim() || null } : {}),
      })
      .where(and(eq(habitsTable.id, id), eq(habitsTable.userId, req.userId!)))
      .returning();
    res.json(habit);
  } catch (err) {
    req.log.error({ err }, "Update habit error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.delete("/habits/:id", async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  try {
    const [existing] = await db.select().from(habitsTable).where(
      and(eq(habitsTable.id, id), eq(habitsTable.userId, req.userId!))
    );
    if (!existing) {
      res.status(404).json({ error: "not_found", message: "Habit not found" });
      return;
    }
    await db.delete(habitsTable).where(and(eq(habitsTable.id, id), eq(habitsTable.userId, req.userId!)));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Delete habit error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.post("/habits/:id/complete", async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const { date } = req.body;
  if (!date) {
    res.status(400).json({ error: "bad_request", message: "Date is required" });
    return;
  }
  try {
    const [existing] = await db.select().from(habitsTable).where(
      and(eq(habitsTable.id, id), eq(habitsTable.userId, req.userId!))
    );
    if (!existing) {
      res.status(404).json({ error: "not_found", message: "Habit not found" });
      return;
    }
    const dates = existing.completedDates as string[];
    if (!dates.includes(date)) {
      dates.push(date);
    }
    const { current, longest } = calcStreak(dates);
    const [habit] = await db.update(habitsTable)
      .set({ completedDates: dates, currentStreak: current, longestStreak: Math.max(longest, existing.longestStreak) })
      .where(and(eq(habitsTable.id, id), eq(habitsTable.userId, req.userId!)))
      .returning();
    res.json(habit);
  } catch (err) {
    req.log.error({ err }, "Complete habit error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.post("/habits/:id/uncomplete", async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id);
  const { date } = req.body;
  if (!date) {
    res.status(400).json({ error: "bad_request", message: "Date is required" });
    return;
  }
  try {
    const [existing] = await db.select().from(habitsTable).where(
      and(eq(habitsTable.id, id), eq(habitsTable.userId, req.userId!))
    );
    if (!existing) {
      res.status(404).json({ error: "not_found", message: "Habit not found" });
      return;
    }
    const dates = (existing.completedDates as string[]).filter((d) => d !== date);
    const { current, longest } = calcStreak(dates);
    const [habit] = await db.update(habitsTable)
      .set({ completedDates: dates, currentStreak: current, longestStreak: Math.max(longest, existing.longestStreak) })
      .where(and(eq(habitsTable.id, id), eq(habitsTable.userId, req.userId!)))
      .returning();
    res.json(habit);
  } catch (err) {
    req.log.error({ err }, "Uncomplete habit error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

export default router;
