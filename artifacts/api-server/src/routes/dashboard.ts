import { Router } from "express";
import { db, habitsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";

const router = Router();

const characterMessages: Record<string, { celebrating: string[]; encouraging: string[]; challenging: string[]; disappointed: string[]; neutral: string[] }> = {
  gojo: { celebrating: ["Too easy. Keep going.", "Perfect. That's the energy."], encouraging: ["You're on the right path.", "That focus? Respect."], challenging: ["Still holding back? Move.", "Let's see that confidence in action."], disappointed: ["Even Gojo expects more. Reset.", "No excuses. Try again."], neutral: ["You're in good company.", "Start clean, finish stronger."] },
  itadori: { celebrating: ["Nice work! Keep that momentum going.", "You did it — one day at a time."], encouraging: ["You're doing great. Stay with it.", "A strong start becomes a strong streak."], challenging: ["Push a little further today.", "You can still win the day."], disappointed: ["Shake it off and restart.", "Tomorrow still belongs to you."], neutral: ["Small steps count.", "Ready when you are."] },
  sukuna: { celebrating: ["Acceptable. Do it again.", "Good. You didn't waste the day."], encouraging: ["Keep your pace sharp.", "Don't slow down now."], challenging: ["You're slipping. Fix it.", "Prove you're not weak."], disappointed: ["Pathetic. Recover immediately.", "That was below standard."], neutral: ["Begin before hesitation returns.", "Your move."] },
  megumi: { celebrating: ["Efficient. Stay consistent.", "Solid work — no wasted motion."], encouraging: ["You're building something steady.", "Keep the shadows moving."], challenging: ["Make the next move count.", "Control the pace."], disappointed: ["Regroup and continue.", "Do not let the day vanish."], neutral: ["Everything starts from focus.", "Choose your next step carefully."] },
  nobara: { celebrating: ["Boom — nailed it.", "That was sharp."], encouraging: ["You're right on track.", "Keep the energy up."], challenging: ["Don't you dare get lazy now.", "Hunt down the rest of the day."], disappointed: ["Tough one. Shake it off.", "Reset and hit back harder."], neutral: ["Let's make today count.", "No time to waste."] },
  toji: { celebrating: ["Clean. Efficient. Deadly.", "No wasted movement."], encouraging: ["Stay sharp. Stay disciplined.", "The edge is in your control."], challenging: ["Move like you mean it.", "Don't hesitate."], disappointed: ["That missed the mark. Recover.", "Get back in control."], neutral: ["Focus first. Act second.", "Keep your hands steady."] },
  nanami: { celebrating: ["Efficient as expected.", "Well done. Precise execution."], encouraging: ["A good rhythm is forming.", "Maintain the ratio."], challenging: ["There's still work to do.", "Finish the task properly."], disappointed: ["You're out of balance. Correct it.", "Return to discipline."], neutral: ["A calm start is a strong start.", "Proceed methodically."] },
  maki: { celebrating: ["Strong result.", "Perfect form."], encouraging: ["Keep pushing with discipline.", "No shortcuts, just progress."], challenging: ["Your body knows the truth. Move.", "Earn it today."], disappointed: ["Reset and recommit.", "You know the standard."], neutral: ["Consistency is the goal.", "Start now."] },
  inumaki: { celebrating: ["Salmon.", "Kelp!"], encouraging: ["Okaka.", "Tuna mayo."], challenging: ["Shake it off. Continue.", "Move with intent."], disappointed: ["..."], neutral: ["Go on.", "Stay steady."] },
  yuta: { celebrating: ["Quiet power, perfect result.", "That was special-grade energy."], encouraging: ["You're stronger than you think.", "Keep going — Rika's watching."], challenging: ["Don't let the pressure shake you.", "Finish with conviction."], disappointed: ["It’s okay to stumble. Rise again.", "Reset and continue."], neutral: ["A calm day is still progress.", "Start softly, finish strong."] },
};

router.get("/dashboard/companion-message", async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    const habits = await db.select().from(habitsTable).where(eq(habitsTable.userId, req.userId!));
    const today = new Date().toISOString().slice(0, 10);
    const total = habits.length;
    const completed = habits.filter((h) => (h.completedDates as string[]).includes(today)).length;
    const rate = total > 0 ? completed / total : 0;
    const character = user?.selectedCharacter || "itadori";
    const msgs = characterMessages[character] || characterMessages.itadori;
    let mood: string;
    let messageList: string[];
    if (rate === 1 && total > 0) { mood = "celebrating"; messageList = msgs.celebrating; }
    else if (rate >= 0.6) { mood = "encouraging"; messageList = msgs.encouraging; }
    else if (rate >= 0.3) { mood = "challenging"; messageList = msgs.challenging; }
    else if (total > 0 && rate < 0.3) { mood = "disappointed"; messageList = msgs.disappointed; }
    else { mood = "neutral"; messageList = msgs.neutral; }
    const message = messageList[Math.floor(Math.random() * messageList.length)];
    res.json({ character, message, mood, completionRate: rate });
  } catch (err) {
    req.log.error({ err }, "Companion message error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

export default router;
