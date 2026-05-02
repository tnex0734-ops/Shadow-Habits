import { Router } from "express";
import { db, habitsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authMiddleware, type AuthRequest } from "../middlewares/auth";

const router = Router();
router.use(authMiddleware);

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function getDateStr(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

function getDayName(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

router.get("/dashboard/summary", async (req: AuthRequest, res) => {
  try {
    const habits = await db.select().from(habitsTable).where(eq(habitsTable.userId, req.userId!));
    const today = getTodayStr();
    const completedToday = habits.filter((h) => (h.completedDates as string[]).includes(today)).length;
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 ? completedToday / totalHabits : 0;
    const longestStreak = habits.reduce((max, h) => Math.max(max, h.longestStreak), 0);
    const totalCompletions = habits.reduce((sum, h) => sum + (h.completedDates as string[]).length, 0);

    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const dateStr = getDateStr(6 - i);
      const completed = habits.filter((h) => (h.completedDates as string[]).includes(dateStr)).length;
      return { date: getDayName(6 - i), completed, total: totalHabits };
    });

    res.json({ totalHabits, completedToday, completionRate, longestStreak, totalCompletions, weeklyData });
  } catch (err) {
    req.log.error({ err }, "Dashboard summary error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.get("/dashboard/insights", async (req: AuthRequest, res) => {
  try {
    const habits = await db.select().from(habitsTable).where(eq(habitsTable.userId, req.userId!));
    const insights: Array<{ id: string; type: string; message: string; habitId?: number; habitTitle?: string }> = [];

    for (const habit of habits) {
      const dates = habit.completedDates as string[];
      if (dates.length === 0) continue;

      if (habit.currentStreak >= 7) {
        insights.push({ id: `streak-${habit.id}`, type: "streak", message: `🔥 ${habit.currentStreak}-day streak on "${habit.title}"! You're unstoppable.`, habitId: habit.id, habitTitle: habit.title });
      }

      const lastWeek = Array.from({ length: 7 }, (_, i) => getDateStr(i));
      const weekendDates = lastWeek.filter((d) => { const day = new Date(d).getDay(); return day === 0 || day === 6; });
      const weekdayDates = lastWeek.filter((d) => { const day = new Date(d).getDay(); return day !== 0 && day !== 6; });
      const weekendCompleted = weekendDates.filter((d) => dates.includes(d)).length;
      const weekdayCompleted = weekdayDates.filter((d) => dates.includes(d)).length;
      if (weekdayDates.length > 0 && weekendDates.length > 0) {
        const weekdayRate = weekdayCompleted / weekdayDates.length;
        const weekendRate = weekendCompleted / weekendDates.length;
        if (weekdayRate > weekendRate + 0.3) {
          insights.push({ id: `weekend-${habit.id}`, type: "consistency", message: `You tend to skip "${habit.title}" on weekends. Try a lighter version for those days.`, habitId: habit.id, habitTitle: habit.title });
        }
      }

      const last3Days = [getDateStr(1), getDateStr(2), getDateStr(3)];
      const missed = last3Days.filter((d) => !dates.includes(d)).length;
      if (missed >= 2) {
        insights.push({ id: `warning-${habit.id}`, type: "warning", message: `You left "${habit.title}" unfinished recently. Don't break the chain!`, habitId: habit.id, habitTitle: habit.title });
      }
    }

    if (insights.length === 0 && habits.length > 0) {
      insights.push({ id: "general-1", type: "encouragement", message: "Keep going! Consistency is the key to mastery. Your future self will thank you." });
    }
    if (habits.length === 0) {
      insights.push({ id: "general-empty", type: "encouragement", message: "Add your first habit to begin your journey. Every legend starts somewhere." });
    }

    res.json(insights.slice(0, 5));
  } catch (err) {
    req.log.error({ err }, "Insights error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.get("/dashboard/streaks", async (req: AuthRequest, res) => {
  try {
    const habits = await db.select().from(habitsTable).where(eq(habitsTable.userId, req.userId!));
    const streaks = habits.map((h) => {
      const dates = h.completedDates as string[];
      const lastCompleted = dates.length > 0 ? [...dates].sort().reverse()[0] : undefined;
      return { habitId: h.id, habitTitle: h.title, currentStreak: h.currentStreak, longestStreak: h.longestStreak, lastCompletedDate: lastCompleted };
    });
    res.json(streaks);
  } catch (err) {
    req.log.error({ err }, "Streaks error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

const characterMessages: Record<string, Record<string, string[]>> = {
  "infinity-mentor": {
    celebrating: [
      "Throughout heaven and earth, I alone am the honored one... and so are you today. Exceptional work.",
      "Infinity isn't just a technique — it's a mindset. You've embraced it perfectly.",
      "I've taught many students, but your consistency? That's on another level.",
    ],
    encouraging: [
      "Even the strongest start somewhere. Keep showing up.",
      "The gap between you and your goal is closing every single day.",
      "I see potential in you that even you haven't noticed yet.",
    ],
    challenging: [
      "Not bad, but I know you can do better. The Honored One doesn't settle for 'okay'.",
      "You've been coasting. Time to unlock your next level.",
      "A warrior trains even when they don't feel like it. Are you a warrior?",
    ],
    disappointed: [
      "Even I can't protect you from yourself. Get back on track.",
      "Skipping your habits is like skipping training. The curses of procrastination grow stronger.",
      "I'm still here. Come back to your practice.",
    ],
    neutral: ["The domain of your potential is limitless. Today is just one step.", "Every habit is a domain expansion of your best self."],
  },
  "dark-king": {
    celebrating: [
      "Impressive. Even I acknowledge your discipline. Don't let it go to your head.",
      "Power flows to those who remain consistent. You've earned a fraction of mine.",
      "The weak make excuses. The strong make progress. You chose strength today.",
    ],
    encouraging: [
      "Suffering builds character. Keep going — the pain is temporary.",
      "A true king doesn't wait for motivation. He moves regardless.",
      "You want power? Then pay the price. Every habit is payment.",
    ],
    challenging: [
      "This is nothing. Show me what you're truly capable of.",
      "Mediocrity is the curse of the weak. Break it.",
      "The only one standing in your way is you. Devour that weakness.",
    ],
    disappointed: [
      "Pathetic. I expected more from someone with your potential.",
      "Even curses have more discipline than this. Rise.",
      "Weakness has many faces. Today, it wears yours.",
    ],
    neutral: ["Power is not given. It is taken through relentless action.", "The throne of your potential awaits. Claim it."],
  },
  "energy-hero": {
    celebrating: [
      "YES! That's what I'm talking about! You're absolutely crushing it!",
      "I'll use 100% of my energy to celebrate you right now! Amazing job!",
      "You did it! I knew you could! This feeling — this is what it's all about!",
    ],
    encouraging: [
      "Even when it's tough, you keep moving. That's real strength!",
      "I'm right here cheering you on. You've got this, I believe in you!",
      "Every small step forward is still a step forward. Let's go!",
    ],
    challenging: [
      "Come on! I know there's more in you! Let's push past our limits together!",
      "We don't run from hard things — we run toward them! What are you waiting for?",
      "Channel that energy! Your habits aren't going to complete themselves!",
    ],
    disappointed: [
      "Hey, it's okay. We all have off days. What matters is we get back up!",
      "Don't give up! I've been knocked down more times than I can count. The secret is getting back up.",
      "I still believe in you. Let's reset and come back stronger tomorrow.",
    ],
    neutral: ["Every day is a new chance to be the best version of yourself!", "Let's make today count — one habit at a time!"],
  },
  "shadow-bearer": {
    celebrating: [
      "All ten shadows are with you today. You've commanded this domain flawlessly.",
      "Even Mahoraga would bow to your discipline. Every technique landed perfectly.",
      "The shikigami acknowledge your strength. You've proven yourself worthy.",
    ],
    encouraging: [
      "The Ten Shadows technique requires patience. Your consistency is building power.",
      "In darkness, the disciplined find their edge. Keep moving forward.",
      "Even incomplete days shape a sorcerer. Don't abandon your training.",
    ],
    challenging: [
      "A shadow sorcerer doesn't flinch. Finish what you started today.",
      "Mahoraga adapts to any technique — you should too. Push through this.",
      "Your shikigami are waiting to be summoned. Don't disappoint them.",
    ],
    disappointed: [
      "The shadows recede when you stop moving. Return to your practice.",
      "Even Megumi never gave up his techniques. Neither should you.",
      "Weakness in training becomes weakness in the domain. Recover now.",
    ],
    neutral: ["Ten shadows, ten chances. Each habit is one technique mastered.", "Precision over brute force — show up consistently, every day."],
  },
  "straw-doll": {
    celebrating: [
      "Nailed it — literally! You crushed every target today without hesitation.",
      "That's the energy! Beauty and strength in perfect balance. I'm impressed.",
      "Resonance achieved! Your habits and your willpower are perfectly aligned today.",
    ],
    encouraging: [
      "A sorcerer doesn't back down just because it's hard. Keep hammering.",
      "I didn't come this far to quit — and neither did you. Let's go.",
      "Every nail driven is progress. Don't stop halfway through the job.",
    ],
    challenging: [
      "Are you seriously slacking? I do not do half-measures. Neither should you.",
      "Hairpin mode: direct, fast, no excuses. Finish your habits now.",
      "I've fought curses tougher than your excuses. Get it done.",
    ],
    disappointed: [
      "I'm not mad, I'm disappointed. And you know that's worse. Fix it tomorrow.",
      "Straw dolls don't work if you don't put in the effort. Neither do habits.",
      "You've got more in you. I've seen it. Get back up and prove it.",
    ],
    neutral: ["Style and substance — that's the goal. Your habits define both.", "Hit the mark, every day. No excuses, no apologies."],
  },
  "ratio-master": {
    celebrating: [
      "7:3 ratio perfectly executed. This is what consistent work looks like — well done.",
      "I don't celebrate often, but today's performance merits acknowledgment. Good work.",
      "Every task completed on time, every habit hit. This is professionalism at its finest.",
    ],
    encouraging: [
      "Work is not glamorous. But it gets done. Keep going.",
      "The ratio matters. Show up today and the numbers will speak for themselves.",
      "I've worked through worse than this. So can you. No complaint, just action.",
    ],
    challenging: [
      "You're off the ratio. Recalibrate and close the gap today.",
      "A Grade 1 sorcerer doesn't let the work pile up. Neither should you.",
      "Overtime begins when discipline ends. Finish what you started.",
    ],
    disappointed: [
      "I'm not here to coddle you. Miss your habits, miss your potential. Simple as that.",
      "The only thing worse than not starting is starting and quitting. Don't be that person.",
      "I've met curses with more consistency than this. Correct yourself.",
    ],
    neutral: ["Work is work. Do it consistently and results follow. That's the ratio.", "7 parts effort, 3 parts rest. Balance your output — then repeat."],
  },
  "iron-body": {
    celebrating: [
      "No cursed energy. No shortcuts. Just pure discipline — and you executed it perfectly today.",
      "This is what Heavenly Restriction looks like in practice. You stripped away excuses and delivered.",
      "Even the Zenin clan couldn't ignore results like yours. You earned every bit of it.",
    ],
    encouraging: [
      "I had nothing to start with either. I built everything through work. So can you.",
      "The gap between where you are and where you want to be closes one habit at a time.",
      "No technique, no shortcut — just show up. That's all I ever did.",
    ],
    challenging: [
      "You have everything you need. Stop hesitating and finish what you started.",
      "Heavenly Restriction gave me nothing but my body. I made it enough. What's your excuse?",
      "Discipline isn't a feeling — it's a habit. Build it today or lose it.",
    ],
    disappointed: [
      "I didn't come this far by taking days off. Neither should you. Get back to it.",
      "The only thing stronger than any curse is consistent effort. Don't throw it away.",
      "Rest is earned, not taken. Come back tomorrow stronger.",
    ],
    neutral: ["Pure effort, no shortcuts. Show up every day and results are inevitable.", "Your body is your weapon. Train it daily — habit by habit."],
  },
  "cursed-voice": {
    celebrating: [
      "...salmon. (Today was perfect. Don't say anything — just feel it.)",
      "Tuna mayo. (Every habit done. That says more than words ever could.)",
      "Okaka. (Flawless execution. I'm proud of you.)",
    ],
    encouraging: [
      "Salmon. (Keep going. The work adds up, even when it doesn't feel like it.)",
      "Mustard leaf. (You're closer than you think. One more step.)",
      "Tuna. (Small steps still move forward. Don't stop.)",
    ],
    challenging: [
      "Spicy cod roe. (You can do more than this. I believe that.)",
      "Okaka. (Stop holding back. Give today everything.)",
      "Salmon. (The gap is closing. Push through.)",
    ],
    disappointed: [
      "...caviar. (It's okay. Tomorrow, we try again.)",
      "Tuna mayo. (Missing a day isn't failing. Giving up is. Come back.)",
      "Mustard leaf. (I'm still here. Pick it back up.)",
    ],
    neutral: ["Salmon. (Each habit is a word spoken with purpose. Make them count.)", "Okaka. (Consistency is the most powerful cursed technique of all.)"],
  },
  "best-friend": {
    celebrating: [
      "AHAHAHA! What a woman! I mean — what a sorcerer! You're incredible today, best friend!",
      "Boogie Woogie! You did it — everything! I knew you had this level in you!",
      "Tell me — what kind of woman do you like?! Actually, doesn't matter. You're amazing today!",
    ],
    encouraging: [
      "A true best friend shows up even when it's hard. You're almost there — keep going!",
      "I've fought beside Itadori because he pushes me. Now you're pushing yourself. Don't stop!",
      "The best part of any rivalry is the grind behind it. Keep grinding, best friend!",
    ],
    challenging: [
      "You're slacking! A best friend doesn't hold back — and neither should you!",
      "Boogie Woogie doesn't work if you're standing still. MOVE. Finish your habits!",
      "Coasting is for strangers. Best friends go all out. What are you waiting for?",
    ],
    disappointed: [
      "Hey. Even I have bad days. What matters is we come back swinging tomorrow.",
      "I never gave up on Itadori. I'm not giving up on you either. Reset and go.",
      "Missing today doesn't make you weak. It makes tomorrow more important. Let's go.",
    ],
    neutral: ["Every day is a chance to prove to your best friend — yourself — what you're made of.", "Boogie Woogie! Swap your excuses for action. Let's do this together."],
  },
};

router.get("/dashboard/companion-message", async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    const habits = await db.select().from(habitsTable).where(eq(habitsTable.userId, req.userId!));

    const today = getTodayStr();
    const total = habits.length;
    const completed = habits.filter((h) => (h.completedDates as string[]).includes(today)).length;
    const rate = total > 0 ? completed / total : 0;

    const character = user?.selectedCharacter || "infinity-mentor";
    const msgs = characterMessages[character] || characterMessages["infinity-mentor"];

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
