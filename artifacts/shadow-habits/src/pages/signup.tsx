import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useSignup } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Zap, Check } from "lucide-react";
import { Link } from "wouter";

const characters = [
  {
    id: "infinity-mentor" as const,
    name: "Infinity Mentor",
    tagline: "The Honored One",
    description: "Calm, limitless, and assured. He sees everything — including your potential.",
    color: "#0ea5e9",
    glow: "rgba(14,165,233,0.4)",
    image: "/src/assets/character-infinity.png",
    gradient: "from-blue-950 to-slate-950",
  },
  {
    id: "dark-king" as const,
    name: "Dark King",
    tagline: "King of Curses",
    description: "Ruthless. Powerful. Demands your absolute best — nothing less.",
    color: "#dc2626",
    glow: "rgba(220,38,38,0.45)",
    image: "/src/assets/character-dark.png",
    gradient: "from-red-950 to-stone-950",
  },
  {
    id: "energy-hero" as const,
    name: "Energy Hero",
    tagline: "The Vessel",
    description: "Boundless energy and unbreakable heart. Cheers you on every single day.",
    color: "#ea580c",
    glow: "rgba(234,88,12,0.4)",
    image: "/src/assets/character-energy.png",
    gradient: "from-orange-950 to-stone-950",
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-8">
      <ParticleBackground />
      <div className="w-full max-w-lg px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-8 border border-white/10"
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5" style={{ color: selected.color }} />
              <span className="font-bold text-lg" style={{ color: selected.color }}>ShadowHabits</span>
            </div>
            <h1 className="text-2xl font-bold">Begin Your Journey</h1>
            <p className="text-muted-foreground text-sm mt-1">Choose your cursed companion first</p>
          </div>

          {/* Character selector */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {characters.map((char) => (
              <motion.button
                key={char.id}
                type="button"
                onClick={() => setSelectedCharacter(char.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all"
                style={
                  selectedCharacter === char.id
                    ? { borderColor: char.color, boxShadow: `0 0 16px ${char.glow}`, backgroundColor: `${char.color}15` }
                    : { borderColor: "rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.03)" }
                }
                data-testid={`character-${char.id}`}
              >
                {selectedCharacter === char.id && (
                  <div
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: char.color }}
                  >
                    <Check className="w-2.5 h-2.5 text-black" />
                  </div>
                )}
                <div
                  className="w-16 h-16 rounded-full overflow-hidden border-2 transition-all"
                  style={{
                    borderColor: selectedCharacter === char.id ? char.color : "rgba(255,255,255,0.1)",
                    boxShadow: selectedCharacter === char.id ? `0 0 16px ${char.glow}` : "none",
                  }}
                >
                  <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground leading-tight">{char.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{char.tagline}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Selected character description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCharacter}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="mb-6 px-4 py-3 rounded-xl border text-sm text-center"
              style={{ borderColor: `${selected.color}40`, backgroundColor: `${selected.color}10`, color: selected.color }}
            >
              {selected.description}
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 px-4 py-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-sm"
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
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
              data-testid="input-name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
              data-testid="input-email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Password (min 6 chars)"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
              data-testid="input-password"
            />

            <motion.button
              type="submit"
              disabled={signupMutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: selected.color, color: "#000", boxShadow: `0 0 20px ${selected.glow}` }}
              data-testid="button-submit"
            >
              {signupMutation.isPending ? "Awakening Cursed Energy..." : `Begin with ${selected.name}`}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already chosen?{" "}
            <Link href="/login" className="font-medium" style={{ color: selected.color }} data-testid="link-login">
              Enter the domain
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
