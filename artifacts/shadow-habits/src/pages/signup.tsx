import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useSignup } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { LogoMark } from "@/components/LogoMark";

const characters = [
  { id: "sukuna" as const, name: "Sukuna", tagline: "King of Curses", description: "Ruthless. Powerful. Demands your absolute best — nothing less.", color: "#FF2020", glow: "rgba(255,32,32,0.42)", image: "/src/assets/character-dark.png" },
  { id: "itadori" as const, name: "Itadori", tagline: "The Vessel", description: "Boundless energy and unbreakable heart. Cheers you on every single day.", color: "#FFA000", glow: "rgba(255,160,0,0.4)", image: "/src/assets/character-energy.png" },
  { id: "megumi" as const, name: "Megumi Fushiguro", tagline: "Ten Shadows", description: "Cold, precise, unstoppable. Commands divine shikigami from the darkness.", color: "#8B5CF6", glow: "rgba(139,92,246,0.42)", image: "/src/assets/character-megumi.png" },
  { id: "nobara" as const, name: "Nobara Kugisaki", tagline: "The Hammer", description: "Fierce and fearless. Crushes every target with nails and raw cursed energy.", color: "#F472B6", glow: "rgba(244,114,182,0.42)", image: "/src/assets/character-nobara.png" },
  { id: "toji" as const, name: "Toji Fushiguro", tagline: "Sorcerer Killer", description: "Zero cursed energy, maximum lethality. Pure discipline and raw physical mastery.", color: "#64748B", glow: "rgba(100,116,139,0.42)", image: "/src/assets/character-toji.png" },
  { id: "nanami" as const, name: "Nanami Kento", tagline: "7:3 Ratio", description: "Disciplined and methodical. Strikes the exact weak point every single day.", color: "#D97706", glow: "rgba(217,119,6,0.42)", image: "/src/assets/character-nanami.png" },
  { id: "maki" as const, name: "Maki Zenin", tagline: "Heavenly Restriction", description: "Pure physical perfection. No shortcuts, no excuses — just relentless discipline.", color: "#CBD5E1", glow: "rgba(203,213,225,0.38)", image: "/src/assets/character-maki.png" },
  { id: "inumaki" as const, name: "Toge Inumaki", tagline: "Cursed Speech", description: "Says little, means everything. Quality over quantity — every word lands.", color: "#10B981", glow: "rgba(16,185,129,0.42)", image: "/src/assets/character-inumaki.png" },
  { id: "yuta" as const, name: "Yuta Okkotsu", tagline: "Special Grade", description: "The most overwhelming cursed energy in a generation. Quiet but unstoppable.", color: "#7C3AED", glow: "rgba(124,58,237,0.42)", image: "/src/assets/character-yuta.png" },
  { id: "gojo" as const, name: "Gojo Satoru", tagline: "Six Eyes", description: "Limitless confidence, impossible speed, and overwhelming presence.", color: "#22D3EE", glow: "rgba(34,211,238,0.42)", image: "/src/assets/character-gojo.png" },
];

type CharacterId = typeof characters[number]["id"];
type SignupCharacter = CharacterId | "infinity-mentor" | "dark-king" | "energy-hero" | "shadow-bearer" | "straw-doll" | "ratio-master" | "iron-body" | "cursed-voice" | "best-friend";

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>("itadori");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"info" | "character">("info");
  const signupMutation = useSignup({ mutation: { onSuccess: (data) => { login(data.token, data.user); setLocation("/dashboard"); }, onError: (err: unknown) => { const e = err as { response?: { data?: { message?: string } } }; setError(e?.response?.data?.message ?? "Signup failed"); } } });
  const selectedChar = characters.find((c) => c.id === selectedCharacter)!;
  const handleSubmit = () => { if (!name.trim() || !email.trim() || !password.trim()) { setError("Please fill in all fields"); return; } setError(""); signupMutation.mutate({ data: { name: name.trim(), email: email.trim(), password, selectedCharacter: selectedCharacter as SignupCharacter } }); };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10 w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
          <LogoMark charColor={selectedChar.color} variant="full" />
          <p className="text-sm mt-3 text-white/40">Choose your companion to begin</p>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 border" style={{ background: "rgba(4,8,20,0.92)", backdropFilter: "blur(32px)", borderColor: `${selectedChar.color}22`, boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px ${selectedChar.color}08` }}>
          <AnimatePresence mode="wait">
            {step === "info" ? (
              <motion.div key="info" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: `${selectedChar.color}80` }}>Step 1 — Your Identity</p>
                {error && <p className="text-sm text-red-400 mb-4 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">{error}</p>}
                {[
                  { label: "Name", value: name, set: setName, placeholder: "Your name", type: "text" },
                  { label: "Email", value: email, set: setEmail, placeholder: "operative@domain.com", type: "email" },
                  { label: "Password", value: password, set: setPassword, placeholder: "••••••••", type: "password" },
                ].map(({ label, value, set, placeholder, type }) => (
                  <div key={label} className="mb-4">
                    <label className="text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: `${selectedChar.color}70` }}>{label}</label>
                    <input type={type} value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder-white/25 text-sm outline-none transition-all" style={{ caretColor: selectedChar.color }} onFocus={(e) => { e.currentTarget.style.borderColor = `${selectedChar.color}40`; e.currentTarget.style.boxShadow = `0 0 0 3px ${selectedChar.color}10`; }} onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }} />
                  </div>
                ))}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { if (!name.trim() || !email.trim() || !password.trim()) { setError("Please fill in all fields"); return; } setError(""); setStep("character"); }} className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 mt-2" style={{ background: `linear-gradient(135deg, ${selectedChar.color}dd, ${selectedChar.color})`, color: "#000", boxShadow: `0 0 24px ${selectedChar.glow}` }}>
                  Next — Choose Companion <ArrowRight className="w-4 h-4" />
                </motion.button>
                <p className="text-center text-xs mt-4 text-white/30">Already enrolled? <Link href="/login" className="font-semibold" style={{ color: selectedChar.color }}>Sign in</Link></p>
              </motion.div>
            ) : (
              <motion.div key="character" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: `${selectedChar.color}80` }}>Step 2 — Choose Companion</p>
                  <button onClick={() => setStep("info")} className="text-xs text-white/30 hover:text-white/60 transition-colors">← Back</button>
                </div>
                {error && <p className="text-sm text-red-400 mb-4 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20">{error}</p>}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {characters.map((char) => {
                    const isSelected = selectedCharacter === char.id;
                    return (
                      <motion.button key={char.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setSelectedCharacter(char.id)} className="relative rounded-2xl p-3 flex flex-col items-center gap-2 border transition-all text-center" style={{ background: isSelected ? `${char.color}12` : "rgba(255,255,255,0.03)", borderColor: isSelected ? `${char.color}50` : "rgba(255,255,255,0.07)", boxShadow: isSelected ? `0 0 20px ${char.color}20` : "none" }}>
                        {isSelected && <motion.div layoutId="char-check" className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: char.color }}><Check className="w-2.5 h-2.5 text-black" /></motion.div>}
                        <div className="w-12 h-12 rounded-xl overflow-hidden border-2" style={{ borderColor: isSelected ? char.color : "rgba(255,255,255,0.1)", boxShadow: isSelected ? `0 0 14px ${char.glow}` : "none" }}><img src={char.image} alt={char.name} className="w-full h-full object-cover" /></div>
                        <div><p className="text-[11px] font-bold leading-tight" style={{ color: isSelected ? char.color : "rgba(255,255,255,0.75)" }}>{char.name}</p><p className="text-[9px] leading-tight mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{char.tagline}</p></div>
                      </motion.button>
                    );
                  })}
                </div>
                <div className="rounded-2xl p-3 mb-4 border flex items-center gap-3" style={{ background: `${selectedChar.color}08`, borderColor: `${selectedChar.color}25` }}>
                  <div className="w-10 h-10 rounded-xl overflow-hidden border flex-shrink-0" style={{ borderColor: selectedChar.color }}><img src={selectedChar.image} alt={selectedChar.name} className="w-full h-full object-cover" /></div>
                  <div><p className="text-xs font-bold" style={{ color: selectedChar.color }}>{selectedChar.name}</p><p className="text-[11px] text-white/45">{selectedChar.description}</p></div>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={signupMutation.isPending} className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2" style={{ background: `linear-gradient(135deg, ${selectedChar.color}dd, ${selectedChar.color})`, color: "#000", boxShadow: `0 0 24px ${selectedChar.glow}`, opacity: signupMutation.isPending ? 0.7 : 1 }}>
                  {signupMutation.isPending ? "Creating..." : "Enter the Domain →"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
