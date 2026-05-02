import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Zap, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { charColor, charGlow, charImage, charName } = useTheme();
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <ParticleBackground />

      <div className="w-full max-w-md px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-8 border border-white/10"
        >
          {/* Character portrait */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full overflow-hidden border-2"
                style={{ borderColor: charColor, boxShadow: `0 0 24px ${charGlow}, 0 0 48px ${charGlow}` }}
              >
                <img src={charImage} alt={charName} className="w-full h-full object-cover" />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: charColor }}
              >
                <Zap className="w-3.5 h-3.5 text-black" />
              </div>
            </div>
          </motion.div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Continue your cursed journey</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 px-4 py-3 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-sm"
              data-testid="error-login"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
                data-testid="input-email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 transition-colors"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loginMutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: charColor,
                color: "#000",
                boxShadow: `0 0 20px ${charGlow}`,
              }}
              data-testid="button-submit"
            >
              {loginMutation.isPending ? "Entering the Domain..." : "Enter the Domain"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            No account yet?{" "}
            <Link href="/signup" className="font-medium" style={{ color: charColor }} data-testid="link-signup">
              Choose your companion
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
