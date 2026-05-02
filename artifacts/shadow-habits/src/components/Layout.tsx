import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Home, Flame, BarChart2, User, LogOut, Shield } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/habits", label: "Habits", icon: Flame },
  { href: "/stats", label: "Stats", icon: BarChart2 },
  { href: "/settings", label: "Character", icon: User },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { charColor, charGlow, charGlowSoft, charImage, charName } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="h-screen flex flex-col bg-background hex-bg overflow-hidden relative">

      {/* TOP NAV */}
      <header
        className="flex-shrink-0 border-b z-50"
        style={{
          background: "rgba(3, 8, 14, 0.95)",
          backdropFilter: "blur(28px)",
          borderBottomColor: `${charColor}20`,
        }}
      >
        <div className="max-w-7xl mx-auto px-5 flex items-center h-12 gap-5">

          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ backgroundColor: `${charColor}18`, border: `1px solid ${charColor}35` }}
            >
              <Shield className="w-3 h-3" style={{ color: charColor }} />
            </div>
            <span
              className="font-display text-base tracking-widest uppercase hidden sm:block"
              style={{ color: charColor, textShadow: `0 0 12px ${charGlow}` }}
            >
              ShadowHabits
            </span>
          </Link>

          <div className="h-5 w-px" style={{ background: `${charColor}25` }} />

          {/* Nav */}
          <nav className="flex items-center gap-0.5 flex-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = location === href || (href === "/dashboard" && location === "/");
              return (
                <Link key={href} href={href}>
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                    style={isActive
                      ? { backgroundColor: `${charColor}16`, color: charColor }
                      : { color: "rgba(255,255,255,0.4)" }
                    }
                    data-testid={`nav-${label.toLowerCase()}`}
                  >
                    <Icon className="w-3.5 h-3.5" style={isActive ? { filter: `drop-shadow(0 0 5px ${charGlow})` } : {}} />
                    <span className="text-xs font-semibold uppercase tracking-wide whitespace-nowrap">{label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-ind"
                        className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                        style={{ backgroundColor: charColor, boxShadow: `0 0 6px ${charGlow}` }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User area */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-6 h-6 rounded-md overflow-hidden border"
              style={{ borderColor: `${charColor}40` }}
            >
              <img src={charImage} alt={charName} className="w-full h-full object-cover" />
            </div>
            {user?.name && (
              <span className="text-xs hidden md:block" style={{ color: `${charColor}80` }}>
                {user.name.split(" ")[0]}
              </span>
            )}
            <button
              onClick={logout}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={e => (e.currentTarget.style.color = charColor)}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
              data-testid="button-logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Glow line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${charGlow}, transparent)`, opacity: 0.5 }}
        />
      </header>

      {/* CONTENT — fills remaining height, no scroll on layout itself */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
