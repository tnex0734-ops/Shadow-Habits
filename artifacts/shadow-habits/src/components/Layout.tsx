import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Flame, BarChart2, Settings, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Today", icon: LayoutDashboard },
  { href: "/habits", label: "Habits", icon: Flame },
  { href: "/stats", label: "Stats", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { charColor, charGlow, charGlowSoft } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background hex-bg relative">
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 border-b px-4 py-3"
        style={{
          background: "rgba(4, 13, 4, 0.85)",
          backdropFilter: "blur(24px)",
          borderBottomColor: `${charColor}18`,
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Brand mark */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center border"
              style={{ borderColor: `${charColor}40`, backgroundColor: `${charColor}12`, boxShadow: `0 0 12px ${charGlow}` }}
            >
              <span className="font-display text-sm font-bold" style={{ color: charColor }}>S</span>
            </div>
            <div>
              <span
                className="font-display text-xl tracking-widest uppercase"
                style={{ color: charColor, textShadow: `0 0 20px ${charGlow}` }}
              >
                ShadowHabits
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user?.name && (
              <span
                className="hidden sm:block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-lg border"
                style={{ borderColor: `${charColor}25`, backgroundColor: `${charColor}0a`, color: charColor }}
              >
                {user.name.split(" ")[0]}
              </span>
            )}
            <button
              onClick={logout}
              className="p-2 rounded-lg transition-all"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = charColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom nav */}
      <nav
        className="sticky bottom-0 z-50 border-t"
        style={{
          background: "rgba(4, 13, 4, 0.92)",
          backdropFilter: "blur(24px)",
          borderTopColor: `${charColor}18`,
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-around px-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = location === href || (href === "/dashboard" && location === "/");
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className="relative flex flex-col items-center gap-1 px-5 py-3 cursor-pointer transition-all"
                  data-testid={`nav-${label.toLowerCase()}`}
                >
                  <Icon
                    className="w-5 h-5 transition-all"
                    style={
                      isActive
                        ? { color: charColor, filter: `drop-shadow(0 0 8px ${charGlow})` }
                        : { color: "rgba(255,255,255,0.3)" }
                    }
                  />
                  <span
                    className="text-xs font-semibold uppercase tracking-wider transition-all"
                    style={isActive ? { color: charColor } : { color: "rgba(255,255,255,0.3)" }}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 h-0.5 w-10 rounded-full"
                      style={{ backgroundColor: charColor, boxShadow: `0 0 8px ${charGlow}` }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
        {/* Bottom ambient glow */}
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${charGlowSoft}, transparent)` }}
        />
      </nav>
    </div>
  );
}
