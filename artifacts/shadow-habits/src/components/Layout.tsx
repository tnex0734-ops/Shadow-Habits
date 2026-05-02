import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Flame, BarChart2, Settings, LogOut, Zap } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Today", icon: LayoutDashboard },
  { href: "/habits", label: "Habits", icon: Flame },
  { href: "/stats", label: "Stats", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { charColor, charGlow } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background hex-bg">
      {/* Top bar */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: charColor, filter: `drop-shadow(0 0 6px ${charGlow})` }} />
            <span className="font-bold text-lg tracking-tight" style={{ color: charColor, textShadow: `0 0 20px ${charGlow}` }}>
              ShadowHabits
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user?.name}</span>
            <button
              onClick={logout}
              className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom nav */}
      <nav className="sticky bottom-0 z-50 glass-card border-t border-border/50">
        <div className="max-w-4xl mx-auto flex items-center justify-around py-2 px-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = location === href || (href === "/dashboard" && location === "/");
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  style={isActive ? { color: charColor } : {}}
                  data-testid={`nav-${label.toLowerCase()}`}
                >
                  <Icon
                    className="w-5 h-5"
                    style={isActive ? { filter: `drop-shadow(0 0 6px ${charGlow})` } : {}}
                  />
                  <span className="text-xs font-medium">{label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-1 h-0.5 w-8 rounded-full"
                      style={{ backgroundColor: charColor }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
