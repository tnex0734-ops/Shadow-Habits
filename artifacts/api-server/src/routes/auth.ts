import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { authMiddleware, signToken, type AuthRequest } from "../middlewares/auth";

const router = Router();

router.post("/auth/signup", async (req, res) => {
  const { name, email, password, selectedCharacter } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "bad_request", message: "Name, email and password are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "bad_request", message: "Password must be at least 6 characters" });
    return;
  }
  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(400).json({ error: "bad_request", message: "Email already registered" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db.insert(usersTable).values({
      name,
      email,
      passwordHash,
      selectedCharacter: selectedCharacter || "itadori",
    }).returning();
    const token = signToken(user.id);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        selectedCharacter: user.selectedCharacter,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Signup error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "bad_request", message: "Email and password are required" });
    return;
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ error: "unauthorized", message: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "unauthorized", message: "Invalid credentials" });
      return;
    }
    const token = signToken(user.id);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        selectedCharacter: user.selectedCharacter,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.get("/auth/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) {
      res.status(401).json({ error: "unauthorized", message: "User not found" });
      return;
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      selectedCharacter: user.selectedCharacter,
      createdAt: user.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Get me error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

router.put("/auth/character", authMiddleware, async (req: AuthRequest, res) => {
  const { selectedCharacter } = req.body;
  const valid = [
    "sukuna","itadori","megumi","nobara","nanami","maki","inumaki","toji","yuta",
    "infinity-mentor","dark-king","energy-hero","shadow-bearer","straw-doll","ratio-master","iron-body","cursed-voice","best-friend",
  ];
  if (!valid.includes(selectedCharacter)) {
    res.status(400).json({ error: "bad_request", message: "Invalid character" });
    return;
  }
  try {
    const [user] = await db.update(usersTable)
      .set({ selectedCharacter })
      .where(eq(usersTable.id, req.userId!))
      .returning();
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      selectedCharacter: user.selectedCharacter,
      createdAt: user.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Update character error");
    res.status(500).json({ error: "server_error", message: "Internal server error" });
  }
});

export default router;
