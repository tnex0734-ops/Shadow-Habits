import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Flame, BarChart2, User } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home",      icon: Home      },
  { href: "/habits",    label: "Habits",    icon: Flame     },
  { href: "/stats",     label: "Stats",     icon: BarChart2 },
  { href: "/settings",  label: "Character", icon: User      },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { charColor, charGlow, charGlowSoft, charImage, charName } = useTheme();
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col bg-background hex-bg overflow-hidden relative">

      {/* ── FULL CONTENT AREA ── */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>

      {/* ══════════════════════════════════════
          FLOATING BOTTOM DOCK — The surprise!
          Glass pill with neon active states
          ══════════════════════════════════════ */}
      <div className="flex-shrink-0 flex justify-center pb-5 pt-3 z-50 relative">

        {/* Subtle ambient glow behind dock */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-20 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${charGlowSoft}, transparent 70%)` }}
        />

        <nav
          className="relative flex items-center gap-1 px-3 py-2.5 rounded-3xl border"
          style={{
            background: "rgba(4, 12, 22, 0.88)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            borderColor: `${charColor}22`,
            boxShadow: `0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px ${charColor}10, inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
        >
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = location === href || (href === "/dashboard" && location === "/");
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.93 }}
                  className="relative flex flex-col items-center justify-center gap-1 px-7 py-2 rounded-2xl cursor-pointer transition-colors select-none"
                  style={isActive
                    ? {
                        backgroundColor: `${charColor}14`,
                        boxShadow: `inset 0 1px 0 ${charColor}20`,
                      }
                    : {}
                  }
                  data-testid={`nav-${label.toLowerCase()}`}
                >
                  {/* Active glow dot above */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="dock-dot"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="absolute -top-1.5 w-4 h-1 rounded-full"
                        style={{ backgroundColor: charColor, boxShadow: `0 0 10px ${charGlow}, 0 0 20px ${charGlow}` }}
                      />
                    )}
                  </AnimatePresence>

                  <Icon
                    className="w-5 h-5 transition-all duration-200"
                    style={isActive
                      ? { color: charColor, filter: `drop-shadow(0 0 8px ${charGlow})` }
                      : { color: "rgba(255,255,255,0.35)" }
                    }
                  />
                  <span
                    className="text-xs font-semibold tracking-wide transition-all duration-200"
                    style={isActive
                      ? { color: charColor }
                      : { color: "rgba(255,255,255,0.3)" }
                    }
                  >
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="w-px h-10 mx-1 rounded-full" style={{ background: `${charColor}18` }} />

          {/* User avatar in dock */}
          <Link href="/settings">
            <motion.div
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.93 }}
              className="flex flex-col items-center gap-1 px-4 py-2 cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-xl overflow-hidden border-2 transition-all"
                style={{
                  borderColor: location === "/settings" ? charColor : `${charColor}35`,
                  boxShadow: location === "/settings" ? `0 0 14px ${charGlow}` : "none",
                }}
              >
                <img src={charImage} alt={charName} className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>
                {user?.name?.split(" ")[0] || "You"}
              </span>
            </motion.div>
          </Link>
        </nav>
      </div>
    </div>
  );
}
