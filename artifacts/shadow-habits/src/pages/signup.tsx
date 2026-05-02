import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useSignup } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const characters = [
  {
    id: "infinity-mentor" as const,
    name: "Infinity Mentor",
    tagline: "The Honored One",
    description: "Calm, limitless, assured. He sees everything — including your potential.",
    color: "#00C8FF",
    glow: "rgba(0,200,255,0.38)",
    glowSoft: "rgba(0,200,255,0.14)",
    image: "/src/assets/character-infinity.png",
  },
  {
    id: "dark-king" as const,
    name: "Dark King",
    tagline: "King of Curses",
    description: "Ruthless. Powerful. Demands your absolute best — nothing less.",
    color: "#FF2020",
    glow: "rgba(255,32,32,0.42)",
    glowSoft: "rgba(255,32,32,0.14)",
    image: "/src/assets/character-dark.png",
  },
  {
    id: "energy-hero" as const,
    name: "Energy Hero",
    tagline: "The Vessel",
    description: "Boundless energy and unbreakable heart. Cheers you on every single day.",
    color: "#FFA000",
    glow: "rgba(255,160,0,0.4)",
    glowSoft: "rgba(255,160,0,0.14)",
    image: "/src/assets/character-energy.png",
  },
];

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<typeof characters[0]["id"]>("infinity-mentor");
  const [error, setError] = useState("");

  const signupMutation = useSignup({
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.user);
        setLocation("/dashboard");
      },
      onError: (err: unknown) => {
        const e = err as { data?: { message?: string } };
        setError(e?.data?.message || "Signup failed. Please try again.");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    signupMutation.mutate({ data: { name, email, password, selectedCharacter } });
  };

  const selected = characters.find((c) => c.id === selectedCharacter)!;

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-8"
      style={{ background: "#040d04" }}
    >
      <ParticleBackground />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${selected.glowSoft} 0%, transparent 65%)`,
          transition: "background 0.5s ease",
        }}
      />

      <div className="w-full max-w-sm px-5 z-10">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p
            className="font-display text-4xl tracking-widest uppercase"
            style={{ color: selected.color, textShadow: `0 0 24px ${selected.glow}` }}
          >
            Begin Your Journey
          </p>
          <p className="text-xs uppercase tracking-widest mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
            Choose your cursed companion
          </p>
        </motion.div>

        {/* Character grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {characters.map((char) => {
            const isSelected = selectedCharacter === char.id;
            return (
              <motion.button
                key={char.id}
                type="button"
                onClick={() => setSelectedCharacter(char.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all"
                style={
                  isSelected
                    ? {
                        borderColor: char.color,
                        backgroundColor: `${char.color}12`,
                        boxShadow: `0 0 20px ${char.glow}, inset 0 0 12px ${char.glowSoft}`,
                      }
                    : {
                        borderColor: "rgba(255,255,255,0.07)",
                        backgroundColor: "rgba(255,255,255,0.03)",
                      }
                }
                data-testid={`character-${char.id}`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: char.color }}
                  >
                    <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                  </motion.div>
                )}
                <div
                  className="w-16 h-16 rounded-xl overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: isSelected ? char.color : "rgba(255,255,255,0.08)",
                    boxShadow: isSelected ? `0 0 16px ${char.glow}` : "none",
                  }}
                >
                  <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-wide leading-tight text-white">{char.name.split(" ")[0]}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{char.tagline}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Companion description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCharacter}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="mb-5 px-4 py-3 rounded-xl border text-xs text-center"
            style={{
              borderColor: `${selected.color}30`,
              backgroundColor: `${selected.color}0a`,
              color: selected.color,
            }}
          >
            {selected.description}
          </motion.div>
        </AnimatePresence>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="rounded-2xl p-5 border"
          style={{
            background: "rgba(8, 20, 8, 0.8)",
            backdropFilter: "blur(24px)",
            borderColor: `${selected.color}20`,
            boxShadow: `0 0 0 1px ${selected.color}08, 0 20px 40px rgba(0,0,0,0.5)`,
            transition: "border-color 0.4s, box-shadow 0.4s",
          }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm border"
              style={{ backgroundColor: "rgba(255,30,30,0.1)", borderColor: "rgba(255,30,30,0.3)", color: "#ff6b6b" }}
              data-testid="error-signup"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Operative name"
              className="cyber-input"
              data-testid="input-name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="operative@domain.com"
              className="cyber-input"
              data-testid="input-email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Password — min 6 chars"
              className="cyber-input"
              data-testid="input-password"
            />

            <motion.button
              type="submit"
              disabled={signupMutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest mt-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                backgroundColor: selected.color,
                color: "#000",
                boxShadow: `0 0 24px ${selected.glow}, 0 4px 16px rgba(0,0,0,0.4)`,
                transition: "background-color 0.4s, box-shadow 0.4s",
              }}
              data-testid="button-submit"
            >
              {signupMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>Activate with {selected.name.split(" ")[0]} <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.35)" }}>
            Already chosen?{" "}
            <Link
              href="/login"
              className="font-bold uppercase tracking-wider"
              style={{ color: selected.color }}
              data-testid="link-login"
            >
              Enter the domain
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
