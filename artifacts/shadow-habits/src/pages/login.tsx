import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { charColor, charGlow, charGlowSoft, charImage, charName } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        login(data.token, data.user);
        setLocation("/dashboard");
      },
      onError: (err: unknown) => {
        const e = err as { data?: { message?: string } };
        setError(e?.data?.message || "Invalid email or password");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ data: { email, password } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "var(--char-gradient-from)" }}>
      <ParticleBackground />

      {/* Big ambient character glow behind everything */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 45%, ${charGlowSoft} 0%, transparent 70%)`,
        }}
      />

      <div className="w-full max-w-sm px-5 z-10">
        {/* Brand header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <p
            className="font-display text-5xl tracking-widest uppercase mb-1"
            style={{ color: charColor, textShadow: `0 0 30px ${charGlow}, 0 0 80px ${charGlowSoft}` }}
          >
            Shadow
          </p>
          <p className="font-display text-5xl tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.9)" }}>
            Habits
          </p>
        </motion.div>

        {/* Character portrait */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div
              className="w-28 h-28 rounded-2xl overflow-hidden border-2"
              style={{
                borderColor: charColor,
                boxShadow: `0 0 30px ${charGlow}, 0 0 60px ${charGlowSoft}, inset 0 0 20px ${charGlowSoft}`,
              }}
            >
              <img src={charImage} alt={charName} className="w-full h-full object-cover" />
            </div>
            {/* Corner tag */}
            <div
              className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: charColor, color: "#000" }}
            >
              {charName.split(" ")[0]}
            </div>
          </div>
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-2xl p-6 border"
          style={{
            background: "rgba(8, 20, 8, 0.8)",
            backdropFilter: "blur(24px)",
            borderColor: `${charColor}20`,
            boxShadow: `0 0 0 1px ${charColor}08, 0 24px 48px rgba(0,0,0,0.5)`,
          }}
        >
          <h1 className="font-display text-2xl tracking-widest uppercase text-white mb-0.5">
            Welcome Back
          </h1>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Continue your cursed journey</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 px-4 py-3 rounded-xl text-sm font-medium border"
              style={{ backgroundColor: "rgba(255,30,30,0.1)", borderColor: "rgba(255,30,30,0.3)", color: "#ff6b6b" }}
              data-testid="error-login"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: `${charColor}90` }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="operative@domain.com"
                className="cyber-input"
                data-testid="input-email"
              />
            </div>
            <div>
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: `${charColor}90` }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="cyber-input pr-12"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loginMutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{
                backgroundColor: charColor,
                color: "#000",
                boxShadow: `0 0 24px ${charGlow}, 0 4px 16px rgba(0,0,0,0.4)`,
              }}
              data-testid="button-submit"
            >
              {loginMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>Enter the Domain <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "rgba(255,255,255,0.35)" }}>
            No account yet?{" "}
            <Link
              href="/signup"
              className="font-bold uppercase tracking-wider"
              style={{ color: charColor }}
              data-testid="link-signup"
            >
              Choose your companion
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
